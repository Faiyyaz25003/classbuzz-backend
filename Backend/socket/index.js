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

    socket.on("user:join", (userId) => {
      if (!userId) return;
      activeUsers.set(userId.toString(), socket.id);
      socket.userId = userId.toString();
      io.emit("user:online", { userId: userId.toString() });
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    socket.on("message:send", async (data) => {
      try {
        const { senderId, receiverId, text, messageType, fileUrl, fileName } = data;

        // create message
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          text: text || "",
          messageType: messageType || "text",
          fileUrl,
          fileName,
          status: "sent",
        });

        // find or create conversation
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
          const receiverUnread = conversation.unreadCount.find(u => u.userId.toString() === receiverId.toString());
          if (receiverUnread) {
            receiverUnread.count = (receiverUnread.count || 0) + 1;
          } else {
            conversation.unreadCount.push({ userId: receiverId, count: 1 });
          }
          await conversation.save();
        }

        // send to receiver if online
        const receiverSocketId = activeUsers.get(receiverId.toString());
        if (receiverSocketId) {
          // update delivered status
          message.status = "delivered";
          message.deliveredTo.push({ userId: receiverId });
          await message.save();

          io.to(receiverSocketId).emit("message:receive", {
            message,
            conversationId: conversation._id,
          });
        }

        // notify sender (ack)
        socket.emit("message:sent", {
          message,
          conversationId: conversation._id,
        });

      } catch (error) {
        console.error("Error in message:send", error);
        socket.emit("message:error", { error: error.message });
      }
    });

    socket.on("message:read", async ({ messageId, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;
        if (!message.readBy.some(r => r.userId.toString() === userId.toString())) {
          message.readBy.push({ userId });
        }
        message.isRead = true;
        message.status = "read";
        await message.save();

        // notify sender
        const senderSocket = activeUsers.get(message.sender.toString());
        if (senderSocket) {
          io.to(senderSocket).emit("message:read", { messageId, userId });
        }

        // update conversation unread counts
        const conv = await Conversation.findOne({ participants: { $all: [message.sender, message.receiver] }});
        if (conv) {
          const u = conv.unreadCount.find(u => u.userId.toString() === userId.toString());
          if (u) u.count = Math.max(0, u.count - 1);
          await conv.save();
        }
      } catch (err) {
        console.error("message:read error", err);
      }
    });

    // typing indicators
    socket.on("typing:start", ({ senderId, receiverId }) => {
      const receiverSocket = activeUsers.get(receiverId.toString());
      if (receiverSocket) io.to(receiverSocket).emit("typing:start", { userId: senderId });
    });

    socket.on("typing:stop", ({ senderId, receiverId }) => {
      const receiverSocket = activeUsers.get(receiverId.toString());
      if (receiverSocket) io.to(receiverSocket).emit("typing:stop", { userId: senderId });
    });

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
