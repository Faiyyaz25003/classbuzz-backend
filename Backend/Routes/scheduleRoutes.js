import express from "express";
import { saveSchedule, getSchedule, getAllSchedules } from "../Controller/scheduleController.js";
const router = express.Router();

router.get("/", getAllSchedules);                            // All Schedules
router.get("/:courseId/:semester", getSchedule);             // Get specific schedule
router.post("/", saveSchedule);                              // Save / Update timetable

export default router;
