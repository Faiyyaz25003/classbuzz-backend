

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
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 50px 20px;">
            
            <!-- Main Container -->
            <table role="presentation" style="width: 100%; max-width: 650px; border-collapse: collapse; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">
              
              <!-- Decorative Top Bar -->
              <tr>
                <td style="height: 8px; background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);"></td>
              </tr>
              
              <!-- Header with Pattern -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative;">
                  <div style="position: relative; z-index: 2;">
                    <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); padding: 15px 30px; border-radius: 50px; margin-bottom: 20px; border: 2px solid rgba(255, 255, 255, 0.3);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 1px;">
                        ✨ ClassBuzz
                      </h1>
                    </div>
                    <p style="margin: 12px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 500; letter-spacing: 0.5px;">
                      Smart Leave Management System
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Floating Status Badge -->
              <tr>
                <td align="center" style="padding: 0; transform: translateY(-35px);">
                  <div style="display: inline-block; background: linear-gradient(135deg, ${isApproved ? '#10b981' : '#ef4444'} 0%, ${isApproved ? '#059669' : '#dc2626'} 100%); border: 5px solid #ffffff; border-radius: 60px; padding: 18px 45px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
                    <span style="font-size: 28px; margin-right: 10px;">${statusIcon}</span>
                    <span style="color: #ffffff; font-weight: 800; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                      ${status}
                    </span>
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 45px 50px 45px;">
                  
                  <!-- Greeting with Icon -->
                  <div style="text-align: center; margin-bottom: 35px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">👋</div>
                    <p style="margin: 0; color: #1f2937; font-size: 18px; line-height: 1.6;">
                      Hello, <strong style="color: #667eea; font-size: 20px;">${userName}</strong>
                    </p>
                  </div>
                  
                  <p style="margin: 0 0 35px 0; color: #4b5563; font-size: 16px; line-height: 1.8; text-align: center;">
                    We're writing to inform you that your leave application has been <strong style="color: ${statusColor};">${status.toLowerCase()}</strong>. Here are the details:
                  </p>
                  
                  <!-- Enhanced Details Card -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-radius: 16px; overflow: hidden; margin-bottom: 35px; border: 2px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <tr>
                      <td style="padding: 35px;">
                        <div style="text-align: center; margin-bottom: 25px;">
                          <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 10px 25px; border-radius: 25px; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                            📋 Leave Details
                          </div>
                        </div>
                        
                        <!-- Leave Type with Icon -->
                        <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 5px solid #667eea; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                          <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: 600;">
                            📝 Leave Type
                          </div>
                          <div style="color: #1f2937; font-size: 18px; font-weight: 700;">
                            ${leaveType}
                          </div>
                        </div>
                        
                        <!-- Duration Cards -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="width: 48%; padding-right: 2%; vertical-align: top;">
                              <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 20px; text-align: center; border: 2px solid #10b981;">
                                <div style="font-size: 32px; margin-bottom: 10px;">📅</div>
                                <div style="color: #065f46; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: 700;">
                                  Start Date
                                </div>
                                <div style="color: #047857; font-size: 16px; font-weight: 700;">
                                  ${formattedFrom}
                                </div>
                              </div>
                            </td>
                            <td style="width: 48%; padding-left: 2%; vertical-align: top;">
                              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; text-align: center; border: 2px solid #f59e0b;">
                                <div style="font-size: 32px; margin-bottom: 10px;">📅</div>
                                <div style="color: #92400e; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: 700;">
                                  End Date
                                </div>
                                <div style="color: #b45309; font-size: 16px; font-weight: 700;">
                                  ${formattedTo}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Status Message with Enhanced Design -->
                  ${isApproved 
                    ? `<div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 6px solid #10b981; padding: 25px; border-radius: 12px; margin-bottom: 35px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);">
                         <div style="font-size: 36px; text-align: center; margin-bottom: 15px;">🎉</div>
                         <p style="margin: 0; color: #065f46; font-size: 15px; line-height: 1.8; text-align: center;">
                           <strong style="font-size: 17px;">Congratulations!</strong><br>
                           Your leave has been approved. Please ensure all necessary handovers are completed before your leave begins. Have a great time!
                         </p>
                       </div>`
                    : `<div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 6px solid #ef4444; padding: 25px; border-radius: 12px; margin-bottom: 35px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);">
                         <div style="font-size: 36px; text-align: center; margin-bottom: 15px;">ℹ️</div>
                         <p style="margin: 0; color: #991b1b; font-size: 15px; line-height: 1.8; text-align: center;">
                           <strong style="font-size: 17px;">Application Not Approved</strong><br>
                           Your leave application could not be approved at this time. Please contact the HR department for more information and guidance.
                         </p>
                       </div>`
                  }
                  
                  <!-- Divider -->
                  <div style="border-top: 2px dashed #e5e7eb; margin: 35px 0;"></div>
                  
                  <!-- Closing -->
                  <div style="text-align: center;">
                    <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 16px;">
                      Best regards,
                    </p>
                    <p style="margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 18px; font-weight: 700;">
                      College HR Team 💼
                    </p>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Footer with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 35px 45px; border-top: 3px solid #e5e7eb;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="text-align: center; padding-bottom: 15px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">
                          AUTOMATED MESSAGE
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                          This is an automated notification from ClassBuzz Leave Management System.
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          © ${new Date().getFullYear()} ClassBuzz. All rights reserved. | Made with ❤️
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Bottom Decorative Bar -->
              <tr>
                <td style="height: 8px; background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);"></td>
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
