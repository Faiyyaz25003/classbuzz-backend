import express from "express";
import {
    getUserNotifications,
    markAsRead,
    markAllRead,
    deleteNotificationForUser,
} from "../Controller/notificationController.js";

const router = express.Router();

// GET    /api/notifications/user/:userId
router.get("/user/:userId", getUserNotifications);

// PUT    /api/notifications/mark-all-read
router.put("/mark-all-read", markAllRead);

// PUT    /api/notifications/:id/read
router.put("/:id/read", markAsRead);

// DELETE /api/notifications/:id/user/:userId
router.delete("/:id/user/:userId", deleteNotificationForUser);

export default router;