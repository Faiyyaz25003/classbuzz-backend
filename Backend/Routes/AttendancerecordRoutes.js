import express from "express";
import {
  getStudentSubjectRecords,
  getTeacherDayRecords,
  checkTodayAttendance,
  getWeeklyReport,
  subjectPercentage,
  exportExcel,
  exportPDF,
} from "../Controller/attendancerecordController.js";

const router = express.Router();

router.get("/student", getStudentSubjectRecords);
router.get("/teacher", getTeacherDayRecords);
router.get("/check", checkTodayAttendance);
router.get("/weekly", getWeeklyReport);
router.get("/subject-percentage", subjectPercentage);
router.get("/export-excel", exportExcel);
router.get("/export-pdf", exportPDF);

export default router;