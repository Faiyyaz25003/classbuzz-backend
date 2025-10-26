


import express from "express";
import { createEvent, getEvents, deleteEvent } from "../Controller/eventController.js";

const router = express.Router();

// Routes
router.post("/", createEvent);
router.get("/", getEvents);
router.delete("/:id", deleteEvent); // ✅ Delete route

export default router;
