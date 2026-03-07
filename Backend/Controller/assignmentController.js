import Assignment from "../models/assignmentModel.js";
import { transporter } from "../config/mailer.js";

/* UPLOAD ASSIGNMENT */

export const uploadAssignment = async (req, res) => {
  try {
    const { studentName, folderId } = req.body;

    const assignment = new Assignment({
      studentName,
      folderId,
      fileUrl: req.file ? req.file.filename : "",
    });

    await assignment.save();

    res.json({
      success: true,
      message: "Assignment uploaded successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ASSIGNMENTS BY FOLDER */

export const getAssignmentsByFolder = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      folderId: req.params.folderId,
    });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* VERIFY ASSIGNMENT */

export const verifyAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: "Verified" },
      { new: true }
    );

    if (assignment.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: assignment.email,
        subject: "Assignment Verified",
        text: "Congratulations! Your assignment has been verified.",
      });
    }

    res.json({
      success: true,
      message: "Assignment verified",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* REJECT ASSIGNMENT */

export const rejectAssignment = async (req, res) => {
  try {
    const { reason } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        status: "Rejected",
        rejectReason: reason,
      },
      { new: true }
    );

    if (assignment.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: assignment.email,
        subject: "Assignment Rejected",
        text: `Your assignment was rejected.\nReason: ${reason}`,
      });
    }

    res.json({
      success: true,
      message: "Assignment rejected",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};