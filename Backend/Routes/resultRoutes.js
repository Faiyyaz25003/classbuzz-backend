import express from "express";
import {
    addResult,
    getAllResults,
    getResultByRollNo,
    deleteResult,
} from "../Controller/resultController.js";

const router = express.Router();

router.post("/", addResult); // Create new result
router.get("/", getAllResults); // Get all results
router.get("/:rollNo", getResultByRollNo); // Get result by roll number
router.delete("/:id", deleteResult); // Delete result

export default router;
