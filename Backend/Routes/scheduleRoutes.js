

import express from "express";
import { addSchedule, getAllSchedules, getScheduleById } from "../Controller/scheduleController.js";

const router = express.Router();

// Routes
router.post("/", addSchedule);           // Add new schedule
router.get("/", getAllSchedules);        // Get all schedules
router.get("/:id", getScheduleById);     // Get schedule by ID

export default router;
