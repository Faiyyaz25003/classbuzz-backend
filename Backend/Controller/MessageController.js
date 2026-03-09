import Message from "../Models/MessageModel.js";
import Conversation from "../Models/ConversationModel.js";
import User from "../Models/UserModels.js";

// Get messages between two users
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

// Get all conversations for a user
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
      const unreadInfo = conv.unreadCount.find(
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

// Mark all messages from otherUser to userId as read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    await Message.updateMany(
      { receiver: userId, sender: otherUserId },
      { isRead: true, status: "read" }
    );

    const conv = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (conv) {
      const u = conv.unreadCount.find(
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

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Search messages for a user
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

