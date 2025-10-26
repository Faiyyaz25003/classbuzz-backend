


import express from "express";
import { createEvent, getEvents, updateEvent , deleteEvent } from "../Controller/eventController.js";

const router = express.Router();

// Routes
router.post("/", createEvent);
router.get("/", getEvents);
// ✅ Update/Edit an event by ID
router.put("/events/:id", updateEvent);
router.delete("/:id", deleteEvent); // ✅ Delete route


export default router;
