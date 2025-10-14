
import Leave from "../Models/LeaveModel.js";
import nodemailer from "nodemailer";

// Configure Nodemailer (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khanfaiyyaz25003@gmail.com",       // <-- replace with your email
    pass: "wrru cxeg jlcx arcq",    // <-- use app password for Gmail
  },
});

// Helper function to send email
const sendStatusEmail = async (toEmail, userName, status, leaveType, fromDate, toDate) => {
  const formattedFrom = new Date(fromDate).toLocaleDateString();
  const formattedTo = new Date(toDate).toLocaleDateString();

  const mailOptions = {
    from: 'ClassBuzz.Faiyyazkhan@gmail.com',
    to: toEmail,
    subject: `Your leave application has been ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #0f4c5c, #1e88a8, #2596be); padding: 20px; color: white; text-align: center;">
            <h2 style="margin: 0;">College HR Leave Notification</h2>
          </div>

          <!-- Body -->
          <div style="padding: 25px;">
            <p>Dear <strong>${userName}</strong>,</p>
            
            <p>Your leave application has been <strong style="color: ${status === 'Approved' ? 'green' : 'red'};">${status}</strong> by the college.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Leave Type:</td>
                <td style="padding: 8px;">${leaveType}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">From Date:</td>
                <td style="padding: 8px;">${formattedFrom}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">To Date:</td>
                <td style="padding: 8px;">${formattedTo}</td>
              </tr>
            </table>

            <p style="margin-top: 20px;">Please contact the college Faculty if you have any questions regarding your leave.</p>

            <p>Best regards,<br/><strong>College Deaprtment</strong></p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #555;">
            This is an automated email. Please do not reply directly to this email.
          </div>

        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail} regarding leave status: ${status}`);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

// -------------------- CONTROLLER FUNCTIONS -------------------- //

// Submit Leave
export const submitLeave = async (req, res) => {
  try {
    const { userName, email, fromDate, toDate, leaveType, approver, reason } = req.body;

    if (!userName || !email || !leaveType || !approver || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
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
    res.status(201).json({ message: "Leave application submitted", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit leave" });
  }
};

// Get all leaves (admin)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
};

// Update Leave Status (Accept / Reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    leave.status = status;
    await leave.save();

    // Send email to user
    await sendStatusEmail(leave.email, leave.userName, status, leave.leaveType, leave.fromDate, leave.toDate);

    res.status(200).json({ message: "Leave status updated and email sent successfully", leave });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ error: "Server error while updating leave status" });
  }
};
