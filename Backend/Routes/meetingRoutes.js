


import express from "express";
import { createMeeting, getMeetings, updateMeeting , deleteMeeting } from "../Controller/MeetingController.js";

const router = express.Router();

// Routes
router.post("/", createMeeting);
router.get("/", getMeetings);
// Update a meeting by ID
router.put("/meetings/:id", updateMeeting);
router.delete("/:id", deleteMeeting); // ✅ Delete meeting route

export default router;
