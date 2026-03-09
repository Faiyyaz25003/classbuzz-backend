
import Message from "../Models/MessageModel.js";
import Conversation from "../Models/ConversationModel.js";

// ── Get messages between two users ───────────────────────
export const getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name profilePic")
      .populate("receiver", "name profilePic");

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Get all conversations for a user ─────────────────────
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email profilePic")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name profilePic" },
      })
      .sort({ updatedAt: -1 });

    const formatted = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId
      );
      const unreadInfo = conv.unreadCount?.find(
        (u) => u.userId.toString() === userId
      );

      return {
        id: conv._id,
        user: otherUser
          ? {
              id: otherUser._id,
              name: otherUser.name,
              img: otherUser.profilePic,
            }
          : null,
        lastMessage: conv.lastMessage
          ? {
              text: conv.lastMessage.text,
              senderName: conv.lastMessage.sender?.name,
              time: conv.lastMessage.createdAt,
            }
          : null,
        unread: unreadInfo?.count || 0,
        updatedAt: conv.updatedAt,
      };
    });

    res.json({ success: true, conversations: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Mark all messages from otherUser → userId as read ────
export const markAllAsRead = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    await Message.updateMany(
      { receiver: userId, sender: otherUserId, isRead: false },
      { isRead: true, status: "read" }
    );

    const conv = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (conv) {
      const u = conv.unreadCount?.find(
        (u) => u.userId.toString() === userId
      );
      if (u) u.count = 0;
      await conv.save();
    }

    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Delete a message ──────────────────────────────────────
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Search messages ───────────────────────────────────────
export const searchMessages = async (req, res) => {
  try {
    const { userId, query } = req.params;
    const messages = await Message.find({
      $and: [
        { $or: [{ sender: userId }, { receiver: userId }] },
        { text: { $regex: query, $options: "i" } },
      ],
    });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Vote on a poll ────────────────────────────────────────
export const votePoll = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, optionIndex } = req.body;

    const message = await Message.findById(messageId);
    if (!message || message.messageType !== "poll") {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    const pd = message.pollData;
    if (!pd) return res.status(400).json({ success: false, message: "No poll data" });

    const voters = pd.voters || {};
    const votes = pd.votes || {};
    const userVotes = voters[userId] || [];

    if (!pd.allowMultiple) {
      // Remove previous vote first
      if (userVotes.length > 0) {
        const prev = userVotes[0];
        votes[prev] = Math.max(0, (votes[prev] || 1) - 1);
      }
      voters[userId] = [optionIndex];
    } else {
      if (userVotes.includes(optionIndex)) {
        return res.json({ success: true, pollData: pd }); // already voted
      }
      voters[userId] = [...userVotes, optionIndex];
    }

    votes[optionIndex] = (votes[optionIndex] || 0) + 1;

    message.pollData = { ...pd, votes, voters };
    message.markModified("pollData");
    await message.save();

    res.json({ success: true, pollData: message.pollData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};