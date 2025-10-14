

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
  const formattedFrom = new Date(fromDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }); 
  const formattedTo = new Date(toDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }); 
 
  const isApproved = status === 'Approved';
  const statusColor = isApproved ? '#10b981' : '#ef4444';
  const statusBg = isApproved ? '#d1fae5' : '#fee2e2';
  const statusIcon = isApproved ? '✓' : '✕';
 
  const mailOptions = { 
    from: '"ClassBuzz Admin" <khanfaiyyaz25003@gmail.com>', 
    to: toEmail, 
    subject: `Leave Application ${status} - ${leaveType}`, 
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leave Application Status</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            
            <!-- Main Container -->
            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                    ClassBuzz
                  </h1>
                  <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">
                    Leave Management System
                  </p>
                </td>
              </tr>
              
              <!-- Status Badge -->
              <tr>
                <td align="center" style="padding: 0; transform: translateY(-25px);">
                  <div style="display: inline-block; background-color: ${statusBg}; border: 3px solid #ffffff; border-radius: 50px; padding: 12px 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                    <span style="font-size: 20px; margin-right: 8px;">${statusIcon}</span>
                    <span style="color: ${statusColor}; font-weight: 700; font-size: 18px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${status}
                    </span>
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  
                  <!-- Greeting -->
                  <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    Dear <strong style="color: #1f2937;">${userName}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                    Your leave application has been processed and the status has been updated to <strong style="color: ${statusColor};">${status}</strong>.
                  </p>
                  
                  <!-- Details Card -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 24px;">
                        <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
                          Leave Details
                        </h3>
                        
                        <!-- Leave Type -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">
                              <strong>Leave Type:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500;">
                              ${leaveType}
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Duration -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 6px; padding: 16px; border: 1px solid #e5e7eb;">
                          <tr>
                            <td style="padding: 0 0 12px 0;">
                              <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                From
                              </div>
                              <div style="color: #1f2937; font-size: 15px; font-weight: 600;">
                                📅 ${formattedFrom}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0 0 0; border-top: 1px solid #f3f4f6;">
                              <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                To
                              </div>
                              <div style="color: #1f2937; font-size: 15px; font-weight: 600;">
                                📅 ${formattedTo}
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Message -->
                  ${isApproved 
                    ? `<div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin-bottom: 30px;">
                         <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
                           <strong>✓ Approved:</strong> Your leave has been approved. Please ensure all necessary handovers are completed before your leave begins.
                         </p>
                       </div>`
                    : `<div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px; margin-bottom: 30px;">
                         <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                           <strong>✕ Not Approved:</strong> Your leave application could not be approved at this time. Please contact HR for more information.
                         </p>
                       </div>`
                  }
                  
                  <!-- Closing -->
                  <p style="margin: 0 0 8px 0; color: #374151; font-size: 15px;">
                    Best regards,
                  </p>
                  <p style="margin: 0; color: #667eea; font-size: 15px; font-weight: 600;">
                    College HR Team
                  </p>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 13px; line-height: 1.6; text-align: center;">
                    This is an automated message from ClassBuzz Leave Management System.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} ClassBuzz. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
    `, 
  }; 
 
  try { 
    await transporter.sendMail(mailOptions); 
    console.log(`✓ Email sent successfully to ${toEmail}`); 
  } catch (err) { 
    console.error(`✕ Email delivery failed for ${toEmail}:`, err.message); 
    throw err; // Re-throw to handle upstream if needed
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
