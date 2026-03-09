
import express from "express";
import {
  getMessages,
  getConversations,
  deleteMessage,
  searchMessages,
  markAllAsRead,
  votePoll,
} from "../Controller/MessageController.js";

const router = express.Router();

// Specific routes first (before param routes)
router.get("/conversations/:userId", getConversations);
router.get("/search/:userId/:query", searchMessages);
router.put("/read/:userId/:otherUserId", markAllAsRead);
router.post("/poll/:messageId/vote", votePoll);
router.delete("/:messageId", deleteMessage);
router.get("/:userId/:otherUserId", getMessages);

export default router;