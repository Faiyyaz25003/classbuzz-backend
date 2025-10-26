


import express from "express";
import { createMeeting, getMeetings, deleteMeeting } from "../Controller/MeetingController.js";

const router = express.Router();

// Routes
router.post("/", createMeeting);
router.get("/", getMeetings);
router.delete("/:id", deleteMeeting); // ✅ Delete meeting route

export default router;
