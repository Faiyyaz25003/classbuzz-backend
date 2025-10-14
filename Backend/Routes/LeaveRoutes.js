

// routes/leaveRoutes.js
import express from "express";
import {
  submitLeave,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} from "../Controller/LeaveController.js"

const router = express.Router();

// Submit leave
router.post("/", submitLeave);

// Get all leaves
router.get("/", getAllLeaves);

// Update leave status
router.put("/:id", updateLeaveStatus);

// Delete leave
router.delete("/:id", deleteLeave); // ✅ Make sure this exists

export default router;
