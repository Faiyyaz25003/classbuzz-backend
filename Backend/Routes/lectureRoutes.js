import express from "express";
import { addLecture, getLectures } from "../Controller/lectureController.js"

const router = express.Router();

router.post("/", addLecture);
router.get("/", getLectures);

export default router;
