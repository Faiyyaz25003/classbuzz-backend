import express from "express";
import {
  createLeave,
  getAllLeaves,
  updateLeaveStatus,
} from "../Controller/leaveController.js";

const router = express.Router();

router.post("/", createLeave); // user applies leave
router.get("/", getAllLeaves); // admin views all
router.put("/:id", updateLeaveStatus); // admin accept/reject

export default router;
