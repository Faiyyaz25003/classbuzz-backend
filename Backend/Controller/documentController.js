
import Document from "../Models/documentModel.js";
import User from "../Models/UserModels.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "khanfaiyyaz25003@gmail.com",
    pass: "jsylzpyjqvxzuhoe",
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
  } else {
    console.log("✅ Email transporter ready — Gmail connected");
  }
});

// ================== Email Templates ==================

const acceptedTemplate = (name, docName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#10b981);padding:36px 40px;text-align:center;">
              <span style="font-size:48px;display:block;margin-bottom:12px;">✅</span>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Document Approved!</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Great news — your submission has been verified</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
                Hello <strong style="color:#059669;">${name}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.7;">
                We're pleased to inform you that your document has been successfully reviewed and <strong>approved</strong> by the admin team.
              </p>

              <!-- Document Card -->
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #10b981;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Approved Document</p>
                <p style="margin:0;font-size:16px;color:#065f46;font-weight:700;">📄 ${docName}</p>
              </div>

              <p style="margin:0 0 8px;color:#6b7280;font-size:14px;line-height:1.6;">
                You can now proceed with the next steps. If you have any questions, feel free to contact the admin office.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:13px;">This is an automated message from <strong style="color:#059669;">School Admin Portal</strong></p>
              <p style="margin:6px 0 0;color:#d1d5db;font-size:12px;">Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const rejectedTemplate = (name, docName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#fff7f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:36px 40px;text-align:center;">
              <span style="font-size:48px;display:block;margin-bottom:12px;">❌</span>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Document Rejected</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Action required — please re-upload a valid document</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
                Hello <strong style="color:#dc2626;">${name}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.7;">
                Unfortunately, your document could not be approved after review. Please re-upload a <strong>clear and valid</strong> version at your earliest convenience.
              </p>

              <!-- Document Card -->
              <div style="background:#fff7f7;border:1px solid #fecaca;border-left:4px solid #ef4444;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Rejected Document</p>
                <p style="margin:0;font-size:16px;color:#991b1b;font-weight:700;">📄 ${docName}</p>
              </div>

              <!-- Reasons -->
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#92400e;">⚠️ Common reasons for rejection:</p>
                <ul style="margin:0;padding-left:18px;color:#78350f;font-size:13px;line-height:2.2;">
                  <li>Document is blurry or unreadable</li>
                  <li>Wrong document uploaded</li>
                  <li>Document is expired or invalid</li>
                  <li>File format not supported</li>
                </ul>
              </div>

              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                Please log in to your portal and re-upload the correct document. Contact the admin office if you need assistance.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:13px;">This is an automated message from <strong style="color:#dc2626;">School Admin Portal</strong></p>
              <p style="margin:6px 0 0;color:#d1d5db;font-size:12px;">Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ================== Helper: Send Email ==================
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"School Admin Portal" <khanfaiyyaz25003@gmail.com>',
      to,
      subject,
      html, // ✅ html use karo, plain text nahi
    });
    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    return false;
  }
};

// ================== Upload Documents ==================
export const uploadDocuments = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files || req.files.length === 0 || !userId) {
      return res.status(400).json({ message: "Files or userId missing" });
    }

    const uploadedDocs = [];

    for (const file of req.files) {
      const index = file.fieldname.replace("file_", "");
      const docName = req.body[`name_${index}`] || file.originalname;

      const newDoc = await Document.create({
        user: userId,
        name: docName,
        fileUrl: file.path,
      });

      uploadedDocs.push(newDoc);
    }

    res.status(201).json({
      message: "Documents Uploaded Successfully",
      data: uploadedDocs,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload Failed" });
  }
};

// ================== Get All Documents ==================
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().populate("user");
    res.json(docs);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Fetch Failed" });
  }
};

// ================== Accept Document ==================
export const acceptDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate("user");
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.status = "accepted";
    await doc.save();

    const emailSent = await sendEmail({
      to: doc.user.email,
      subject: "✅ Document Approved — School Admin Portal",
      html: acceptedTemplate(doc.user.name, doc.name),
    });

    res.json({
      message: emailSent
        ? "Document Accepted & Email Sent"
        : "Document Accepted (Email failed — check server logs)",
    });
  } catch (error) {
    console.error("Accept error:", error);
    res.status(500).json({ message: "Accept Failed" });
  }
};

// ================== Reject Document ==================
export const rejectDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate("user");
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.status = "rejected";
    await doc.save();

    const emailSent = await sendEmail({
      to: doc.user.email,
      subject: "❌ Document Rejected — Action Required",
      html: rejectedTemplate(doc.user.name, doc.name),
    });

    res.json({
      message: emailSent
        ? "Document Rejected & Email Sent"
        : "Document Rejected (Email failed — check server logs)",
    });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ message: "Reject Failed" });
  }
};

// ================== Delete Document ==================
export const deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document Deleted Successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete Failed" });
  }
};