import express from "express";
import {
    getMessages,
    getConversations,
    deleteMessage,
    searchMessages,
    markAllAsRead,
    getMessagesBetweenUsers,
 

} from "../Controller/MessageController.js";

const router = express.Router();

router.get("/conversations/:userId", getConversations);
router.get("/search/:userId/:query", searchMessages);
router.put("/read/:userId/:otherUserId", markAllAsRead);
router.delete("/:messageId", deleteMessage);
router.get("/:userId/:otherUserId", getMessages);

router.get("/:senderId/:receiverId", getMessagesBetweenUsers);



export default router;
