import express from "express";
import {
  getAllCourses,
  addSubject,
  updateSubject,
  deleteCourse
} from "../Controller/courseController.js";

const router = express.Router();

router.get("/", getAllCourses);
router.post("/subject", addSubject);
router.put("/:courseId/semester/:semester/subject/:subjectId", updateSubject);
router.delete("/:courseId", deleteCourse);

export default router;
