import Leave from "../Models/LeaveModel.js";

import nodemailer from "nodemailer";

// ===== Create Leave Request =====
export const createLeave = async (req, res) => {
  try {
    const { userId, reason, fromDate, toDate } = req.body;
    const leave = new Leave({ userId, reason, fromDate, toDate, status: "Pending" });
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Error creating leave", error });
  }
};

// ===== Get All Leave Requests =====
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("userId", "name email");
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves", error });
  }
};

// ===== Update Leave Status (Accept/Reject) =====
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await Leave.findById(id).populate("userId", "email name");
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = status;
    await leave.save();

    // ===== Send Email =====
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject =
      status === "Accepted"
        ? "Your Leave Request has been Approved"
        : "Your Leave Request has been Rejected";

    const message = `
      Hi ${leave.userId.name},
      <br/><br/>
      Your leave request from <b>${leave.fromDate}</b> to <b>${leave.toDate}</b> 
      has been <b>${status}</b>.
      <br/><br/>
      Regards,<br/>HR Department
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: leave.userId.email,
      subject,
      html: message,
    });

    res.json({ message: `Leave ${status} and email sent successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave status", error });
  }
};
