import express from "express";
import {
    getStudentSubjectRecords,
    getTeacherDayRecords,
    checkTodayAttendance,
} from "../Controller/attendancerecordController.js";

const router = express.Router();

// Student: apna subject ka full record
router.get("/student", getStudentSubjectRecords);

// Teacher: ek subject ka ek din ka sheet
router.get("/teacher", getTeacherDayRecords);

// Check: aaj attendance hai ya nahi
router.get("/check", checkTodayAttendance);

export default router;