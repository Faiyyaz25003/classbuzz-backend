import Document from "../Models/documentModel.js";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

// Nodemailer setup (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email
    pass: process.env.EMAIL_PASS, // App password or Gmail password
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

// Upload Documents
export const uploadDocuments = async (req, res) => {
  try {
    const { userId } = req.body;
    const files = req.files;

    const doc = new Document({
      userId,
      aadhar: files.aadhar ? files.aadhar[0].path : "",
      marksheet: files.marksheet ? files.marksheet[0].path : "",
      photo: files.photo ? files.photo[0].path : "",
      custom: files.custom ? files.custom.map((f) => f.path) : [],
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all documents
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Accept document
export const acceptDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    // Send email to user
    await sendEmail(
      doc.userId, // assuming userId is the email
      "Document Status Update ✅",
      "Your document has been accepted by the admin."
    );

    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject document
export const rejectDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    // Send email to user
    await sendEmail(
      doc.userId, // assuming userId is the email
      "Document Status Update ❌",
      "Your document has been rejected by the admin. Please review and resubmit."
    );

    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);

    // Delete files from uploads folder
    if (doc) {
      [doc.aadhar, doc.marksheet, doc.photo, ...doc.custom].forEach((file) => {
        if (file && fs.existsSync(file)) fs.unlinkSync(file);
      });
    }

    res.json({ message: "Document deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};