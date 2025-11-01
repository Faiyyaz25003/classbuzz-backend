
import fs from "fs";
import path from "path";
import Document from "../Models/documentModel.js";

export const uploadDocument = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const aadhaarFront = req.files?.aadhaarFront?.[0]?.filename || null;
    const aadhaarBack = req.files?.aadhaarBack?.[0]?.filename || null;
    const pan = req.files?.pan?.[0]?.filename || null;

    // ✅ Find existing record for this user
    let document = await Document.findOne({ userId });

    if (document) {
      // ✅ Update only changed files
      if (aadhaarFront) document.aadhaarFront = aadhaarFront;
      if (aadhaarBack) document.aadhaarBack = aadhaarBack;
      if (pan) document.pan = pan;
      await document.save();
    } else {
      // ✅ Create new if not exist
      document = new Document({
        userId,
        aadhaarFront,
        aadhaarBack,
        pan,
      });
      await document.save();
    }

    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch all users' documents (unique per user)
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

// ✅ Delete a document by userId
export const deleteDocument = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validation
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID is required" 
      });
    }

    // Find document
    const document = await Document.findOne({ userId });
    if (!document) {
      return res.status(404).json({ 
        success: false,
        message: "Document not found for this user" 
      });
    }

    // ✅ Delete files from /uploads folder
    const uploadPath = path.join(process.cwd(), "uploads");
    
    const deleteFile = (fileName) => {
      if (fileName) {
        try {
          const filePath = path.join(uploadPath, fileName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`✅ Deleted file: ${fileName}`);
          }
        } catch (fileErr) {
          console.error(`⚠️ Error deleting file ${fileName}:`, fileErr);
          // Continue execution even if file deletion fails
        }
      }
    };

    // Delete all document files
    deleteFile(document.aadhaarFront);
    deleteFile(document.aadhaarBack);
    deleteFile(document.pan);

    // ✅ Delete MongoDB record
    await Document.deleteOne({ userId });

    console.log(`✅ Document deleted for userId: ${userId}`);

    res.status(200).json({
      success: true,
      message: "Document and associated files deleted successfully",
      deletedUserId: userId,
    });

  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error while deleting document",
      error: err.message 
    });
  }
};