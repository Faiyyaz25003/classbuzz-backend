import Document from "../Models/documentModel.js";
import User from "../Models/UserModels.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================== Upload Documents ==================

export const uploadDocuments = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files || req.files.length === 0 || !userId) {
      return res.status(400).json({ message: "Files or userId missing" });
    }

    const uploadedDocs = [];

    // ✅ FIX: req.files ab array hai (upload.any() se), object nahi
    for (const file of req.files) {
      // file.fieldname = "file_0", "file_1", etc.
      const index = file.fieldname.replace("file_", ""); // "0", "1", ...
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
    console.error(error);
    res.status(500).json({ message: "Upload Failed" });
  }
};

// ================== Get All Documents ==================

export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().populate("user");
    res.json(docs);
  } catch (error) {
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: doc.user.email,
      subject: "Document Accepted ✅",
      text: `Hello ${doc.user.name}, your document "${doc.name}" has been accepted.`,
    });

    res.json({ message: "Document Accepted & Email Sent" });
  } catch (error) {
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: doc.user.email,
      subject: "Document Rejected ❌",
      text: `Hello ${doc.user.name}, your document "${doc.name}" has been rejected.`,
    });

    res.json({ message: "Document Rejected & Email Sent" });
  } catch (error) {
    res.status(500).json({ message: "Reject Failed" });
  }
};

// ================== Delete Document ==================

export const deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete Failed" });
  }
};