

import Document from "../Models/documentModel.js";
import User from "../Models/UserModels.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "khanfaiyyaz25003@gmail.com",
    pass: "jsylzpyjqvxzuhoe", // App Password (spaces hata diye)
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
  } else {
    console.log("✅ Email transporter ready — Gmail connected");
  }
});

// ================== Helper: Send Email ==================
// ✅ FIX 3: Email ko alag helper mein nikala — error se main response block na ho
const sendEmail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"School Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (err) {
    // ✅ Full error log karo — isse pata chalega exact problem
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

    // ✅ FIX 4: Email fail hone par bhi response bhejo — dono independent hain
    const emailSent = await sendEmail({
      to: doc.user.email,
      subject: "Document Accepted ✅",
      text: `Hello ${doc.user.name},\n\nYour document "${doc.name}" has been accepted.\n\nRegards,\nSchool Admin`,
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
      subject: "Document Rejected ❌",
      text: `Hello ${doc.user.name},\n\nYour document "${doc.name}" has been rejected. Please re-upload a valid document.\n\nRegards,\nSchool Admin`,
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