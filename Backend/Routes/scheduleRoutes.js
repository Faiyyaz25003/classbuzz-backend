// import express from "express";
// import { saveSchedule, getSchedule, getAllSchedules } from "../Controller/scheduleController.js";
// const router = express.Router();

// router.get("/", getAllSchedules);                            // All Schedules
// router.get("/:courseId/:semester", getSchedule);             // Get specific schedule
// router.post("/", saveSchedule);                              // Save / Update timetable

// export default router;

import express from "express";
import { addSchedule, getAllSchedules, getScheduleById } from "../Controller/scheduleController.js";

const router = express.Router();

// Routes
router.post("/", addSchedule);           // Add new schedule
router.get("/", getAllSchedules);        // Get all schedules
router.get("/:id", getScheduleById);     // Get schedule by ID

export default router;
