import Leave from "../Models/LeaveModel.js";
import path from "path";
import fs from "fs";

// Submit Leave
export const submitLeave = async (req, res) => {
  try {
    const { fromDate, toDate, leaveType, approver, reason } = req.body;

    if (!leaveType || !approver || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let attachmentPath = null;
    if (req.file) {
      attachmentPath = `/uploads/${req.file.filename}`;
    }

    const leave = new Leave({
      fromDate,
      toDate,
      leaveType,
      approver,
      reason,
      attachment: attachmentPath,
    });

    await leave.save();
    res.status(201).json({ message: "Leave application submitted", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit leave" });
  }
};

// Get all leaves (for admin panel later)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
};


// Update Leave Status (Accept / Reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params; // leave ID from URL
    const { status } = req.body; // new status from frontend

    // Validate input
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Check if leave exists
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    // Update the status
    leave.status = status;
    await leave.save();

    res.status(200).json({ message: "Leave status updated successfully", leave });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ error: "Server error while updating leave status" });
  }
};
