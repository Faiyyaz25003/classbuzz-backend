import express from "express";
import { savePunch, getPunchHistory } from "../Controller/attendanceController.js";

const router = express.Router();

router.post("/punch", savePunch);     // Save punch in/out
router.get("/history", getPunchHistory); // Get punch history

export default router;
