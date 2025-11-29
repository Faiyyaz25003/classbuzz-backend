
import express from "express";
import { createResult, getResultByRoll, getAllResults } from "../Controller/resultController.js";

const router = express.Router();

router.post("/", createResult);             // Submit result
router.get("/", getAllResults);            // (optional) show all results
router.get("/:roll", getResultByRoll);     // Search result by roll number

export default router;
