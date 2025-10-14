

import Leave from "../models/LeaveModel.js";
import nodemailer from "nodemailer";
import path from "path";

// -------------------- EMAIL SETUP -------------------- //
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khanfaiyyaz25003@gmail.com", // your email
    pass: "wrru cxeg jlcx arcq",        // app password
  },
});

// -------------------- HELPER -------------------- //
const sendStatusEmail = async (toEmail, userName, status, leaveType, fromDate, toDate) => {
  const formattedFrom = new Date(fromDate).toLocaleDateString();
  const formattedTo = new Date(toDate).toLocaleDateString();

  const mailOptions = {
    from: '"College HR" <khanfaiyyaz25003@gmail.com>',
    to: toEmail,
    subject: `Your leave application has been ${status}`,
    html: `<div>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Your leave application has been <strong style="color:${status==='Approved'?'green':'red'};">${status}</strong></p>
      <p>Leave Type: ${leaveType}</p>
      <p>From: ${formattedFrom}</p>
      <p>To: ${formattedTo}</p>
      <p>Best regards,<br/>College HR</p>
    </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", toEmail);
  } catch (err) {
    console.error("Email failed:", err);
  }
};

// -------------------- CONTROLLER FUNCTIONS -------------------- //
export const submitLeave = async (req, res) => {
  try {
    const { userName, email, fromDate, toDate, leaveType, approver, reason } = req.body;

    if (!userName || !email || !leaveType || !approver || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let attachmentPath = null;
    if (req.file) {
      attachmentPath = `/uploads/${req.file.filename}`;
    }

    const leave = new Leave({
      userName,
      email,
      fromDate,
      toDate,
      leaveType,
      approver,
      reason,
      attachment: attachmentPath,
    });

    await leave.save();
    res.status(201).json({ message: "Leave submitted", leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit leave" });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ error: "Leave not found" });

    leave.status = status;
    await leave.save();

    await sendStatusEmail(leave.email, leave.userName, status, leave.leaveType, leave.fromDate, leave.toDate);

    res.status(200).json({ message: "Leave updated", leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ error: "Leave not found" });

    await Leave.findByIdAndDelete(id);
    res.status(200).json({ message: "Leave deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
