

import { Server } from "socket.io";
import Message from "../Models/MessageModel.js";
import Conversation from "../Models/ConversationModel.js";

const activeUsers = new Map(); // userId -> socketId

export const initializeWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ── User joins ────────────────────────────────────────
    socket.on("user:join", (userId) => {
      if (!userId) return;
      activeUsers.set(userId.toString(), socket.id);
      socket.userId = userId.toString();
      io.emit("user:online", { userId: userId.toString() });
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    // ── Send a message (text / photo / document / voice / poll) ──
    socket.on("message:send", async (data) => {
      try {
        const {
          senderId,
          receiverId,
          text,
          messageType,
          _tempId,
          // rich fields
          photoSrc,
          docData,
          voiceData,
          pollData,
          // legacy plain-file fields
          fileUrl,
          fileName,
        } = data;

        // ── 1. Build message payload ──────────────────────
        const msgPayload = {
          sender: senderId,
          receiver: receiverId,
          text: text || "",
          messageType: messageType || "text",
          _tempId: _tempId || null,
          status: "sent",
        };

        // Photo
        if (messageType === "photo" && photoSrc) {
          msgPayload.photoSrc = photoSrc;
        }

        // Document
        if (messageType === "document" && docData) {
          msgPayload.docData = {
            name: docData.name,
            size: docData.size,
            dataUrl: docData.dataUrl,
            mimeType: docData.mimeType || null,
          };
        }

        // Voice — never store blobUrl (browser-only), only duration
        if (messageType === "voice" && voiceData) {
          msgPayload.voiceData = {
            duration: voiceData.duration || 0,
            audioUrl: voiceData.audioUrl || null, // only if you uploaded to cloud
          };
        }

        // Poll
        if (messageType === "poll" && pollData) {
          msgPayload.pollData = {
            question: pollData.question,
            options: pollData.options,
            allowMultiple: pollData.allowMultiple || false,
            votes: {},
            voters: {},
          };
        }

        // Legacy file fields
        if (fileUrl) msgPayload.fileUrl = fileUrl;
        if (fileName) msgPayload.fileName = fileName;

        // ── 2. Save to DB ─────────────────────────────────
        const message = await Message.create(msgPayload);

        // ── 3. Find or create conversation ────────────────
        let conversation = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] },
          isGroup: false,
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [senderId, receiverId],
            lastMessage: message._id,
            lastMessageTime: new Date(),
            unreadCount: [
              { userId: senderId, count: 0 },
              { userId: receiverId, count: 1 },
            ],
          });
        } else {
          conversation.lastMessage = message._id;
          conversation.lastMessageTime = new Date();

          const receiverUnread = conversation.unreadCount.find(
            (u) => u.userId.toString() === receiverId.toString()
          );
          if (receiverUnread) {
            receiverUnread.count = (receiverUnread.count || 0) + 1;
          } else {
            conversation.unreadCount.push({ userId: receiverId, count: 1 });
          }
          await conversation.save();
        }

        // ── 4. Deliver to receiver if online ──────────────
        const receiverSocketId = activeUsers.get(receiverId.toString());
        if (receiverSocketId) {
          message.status = "delivered";
          if (!message.deliveredTo.some((d) => d.userId.toString() === receiverId.toString())) {
            message.deliveredTo.push({ userId: receiverId });
          }
          await message.save();

          io.to(receiverSocketId).emit("message:receive", {
            message,
            conversationId: conversation._id,
          });
        }

        // ── 5. Acknowledge sender ─────────────────────────
        socket.emit("message:sent", {
          message,
          conversationId: conversation._id,
        });
      } catch (error) {
        console.error("Error in message:send:", error);
        socket.emit("message:error", { error: error.message });
      }
    });

    // ── Mark message as read ──────────────────────────────
    socket.on("message:read", async ({ messageId, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        if (!message.readBy.some((r) => r.userId.toString() === userId.toString())) {
          message.readBy.push({ userId });
        }
        message.isRead = true;
        message.status = "read";
        await message.save();

        // Notify original sender
        const senderSocket = activeUsers.get(message.sender.toString());
        if (senderSocket) {
          io.to(senderSocket).emit("message:read", { messageId, userId });
        }

        // Decrement unread in conversation
        const conv = await Conversation.findOne({
          participants: { $all: [message.sender, message.receiver] },
        });
        if (conv) {
          const u = conv.unreadCount.find(
            (u) => u.userId.toString() === userId.toString()
          );
          if (u) u.count = Math.max(0, u.count - 1);
          await conv.save();
        }
      } catch (err) {
        console.error("message:read error:", err);
      }
    });

    // ── Poll vote via socket ───────────────────────────────
    socket.on("poll:vote", async ({ messageId, userId, optionIndex }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message || message.messageType !== "poll" || !message.pollData) return;

        const pd = message.pollData;
        const voters = pd.voters || {};
        const votes = pd.votes || {};
        const userVotes = voters[userId] || [];

        if (!pd.allowMultiple) {
          if (userVotes.length > 0) {
            const prev = userVotes[0];
            votes[prev] = Math.max(0, (votes[prev] || 1) - 1);
          }
          voters[userId] = [optionIndex];
        } else {
          if (userVotes.includes(optionIndex)) return;
          voters[userId] = [...userVotes, optionIndex];
        }

        votes[optionIndex] = (votes[optionIndex] || 0) + 1;
        message.pollData = { ...pd, votes, voters };
        message.markModified("pollData");
        await message.save();

        // Broadcast updated poll to both sender and receiver
        const participantIds = [message.sender.toString(), message.receiver.toString()];
        participantIds.forEach((uid) => {
          const sid = activeUsers.get(uid);
          if (sid) {
            io.to(sid).emit("poll:updated", {
              messageId,
              pollData: message.pollData,
            });
          }
        });
      } catch (err) {
        console.error("poll:vote error:", err);
      }
    });

    // ── Typing indicators ─────────────────────────────────
    socket.on("typing:start", ({ senderId, receiverId }) => {
      const receiverSocket = activeUsers.get(receiverId.toString());
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing:start", { userId: senderId });
      }
    });

    socket.on("typing:stop", ({ senderId, receiverId }) => {
      const receiverSocket = activeUsers.get(receiverId.toString());
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing:stop", { userId: senderId });
      }
    });

    // ── Disconnect ────────────────────────────────────────
    socket.on("disconnect", () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        io.emit("user:offline", { userId: socket.userId });
        console.log(`User ${socket.userId} disconnected`);
      }
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export default initializeWebSocket;