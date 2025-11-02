

import Document from "../Models/documentModel.js";
import path from "path";
import fs from "fs";

export const uploadDocuments = async (req, res) => {
  try {
    const { name } = req.body;
    const files = req.files;

    const newDoc = new Document({
      name,
      aadhaar: files.aadhaar ? files.aadhaar[0].path : null,
      marksheet: files.marksheet ? files.marksheet[0].path : null,
      photo: files.photo ? files.photo[0].path : null,
      status: "pending",
    });

    await newDoc.save();
    res.json({ message: "Documents uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

// ✅ Download document
export const downloadDocument = async (req, res) => {
  try {
    const { id, field } = req.params;
    const doc = await Document.findById(id);
    if (!doc || !doc[field]) 
      return res.status(404).json({ message: "File not found" });

    const filePath = path.join(process.cwd(), doc[field]);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Error downloading file" });
  }
};

// 🗑️ Delete specific document field
export const deleteDocument = async (req, res) => {
  try {
    const { id, field } = req.params;
    const doc = await Document.findById(id);
    
    if (!doc) 
      return res.status(404).json({ message: "User not found" });

    if (!doc[field]) 
      return res.status(404).json({ message: "Document not found" });

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), doc[field]);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update database - set field to null
    doc[field] = null;
    await doc.save();

    res.json({ message: `${field} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting document" });
  }
};

// 🗑️ Delete entire user record
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) 
      return res.status(404).json({ message: "User not found" });

    // Delete all files from filesystem
    ["aadhaar", "marksheet", "photo"].forEach((field) => {
      if (doc[field]) {
        const filePath = path.join(process.cwd(), doc[field]);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // Delete user from database
    await Document.findByIdAndDelete(id);

    res.json({ message: "User and all documents deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// ✅ Accept Document
export const acceptDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if all documents are uploaded
    if (!document.aadhaar || !document.marksheet || !document.photo) {
      return res.status(400).json({ message: "All documents must be uploaded before accepting" });
    }

    document.status = "accepted";
    await document.save();

    res.status(200).json({ message: "Documents accepted successfully", document });
  } catch (error) {
    console.error("Error accepting document:", error);
    res.status(500).json({ message: "Server error while accepting document" });
  }
};

// ❌ Reject Document
export const rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.status = "rejected";
    document.rejectionReason = reason || "";
    await document.save();

    res.status(200).json({ message: "Documents rejected successfully", document });
  } catch (error) {
    console.error("Error rejecting document:", error);
    res.status(500).json({ message: "Server error while rejecting document" });
  }
};