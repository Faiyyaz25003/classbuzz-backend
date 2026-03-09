import express from "express";
import {
  getMessages,
  getConversations,
  deleteMessage,
  searchMessages,
  markAllAsRead,
} from "../Controller/MessageController.js";

const router = express.Router();

// ✅ Specific routes first — before param routes
router.get("/conversations/:userId", getConversations);
router.get("/search/:userId/:query", searchMessages);
router.put("/read/:userId/:otherUserId", markAllAsRead);
router.delete("/:messageId", deleteMessage);
router.get("/:userId/:otherUserId", getMessages);

// ❌ REMOVED duplicate: router.get("/:senderId/:receiverId", getMessagesBetweenUsers)
//    It was identical to the route above and was never reached by Express.

export default router;