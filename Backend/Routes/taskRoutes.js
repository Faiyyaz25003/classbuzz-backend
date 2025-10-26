

import express from "express";
import { createTask, getTasks, deleteTask } from "../Controller/taskController.js";

const router = express.Router();

// Routes
router.post("/", createTask);
router.get("/", getTasks);
router.delete("/:id", deleteTask); // ✅ Delete Task Route

export default router;
