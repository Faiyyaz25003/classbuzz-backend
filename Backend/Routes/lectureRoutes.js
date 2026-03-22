import express from "express";
import {
  addLecture,
  getLectures,
  deleteLecture,
} from "../Controller/lectureController.js";
import uploadLectureVideo from "../Middleware/uploadLectureVideo.js";

const router = express.Router();

router.post("/", uploadLectureVideo.single("videoFile"), addLecture);
router.get("/", getLectures);
router.delete("/:id", deleteLecture);

export default router;