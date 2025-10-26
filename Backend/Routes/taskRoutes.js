

import express from "express";
import { createTask, getTasks, updateTask , deleteTask } from "../Controller/taskController.js";

const router = express.Router();

// Routes
router.post("/", createTask);
router.get("/", getTasks);
// Update a task by ID
router.put("/:id", updateTask);
router.delete("/:id", deleteTask); // ✅ Delete Task Route

export default router;
