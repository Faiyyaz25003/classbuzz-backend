
import Document from "../Models/documentModel.js";
import path from "path";

export const uploadDocument = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find existing document or create new one
    let document = await Document.findOne({ userId });
    if (!document) document = new Document({ userId });

    // Update file paths
    if (req.files.aadhaarFront)
      document.aadhaarFront = req.files.aadhaarFront[0].path;
    if (req.files.aadhaarBack)
      document.aadhaarBack = req.files.aadhaarBack[0].path;
    if (req.files.pan)
      document.pan = req.files.pan[0].path;

    await document.save();

    // Full URLs for frontend preview
    const baseUrl = `${req.protocol}://${req.get("host")}/`;
    const addFullPath = (filePath) => (filePath ? baseUrl + filePath : null);

    res.status(200).json({
      message: "✅ Document uploaded successfully",
      data: {
        ...document.toObject(),
        aadhaarFront: addFullPath(document.aadhaarFront),
        aadhaarBack: addFullPath(document.aadhaarBack),
        pan: addFullPath(document.pan),
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading document", error: err });
  }
};

// ✅ Get all documents
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find();

    const baseUrl = `${req.protocol}://${req.get("host")}/`;
    const formatted = documents.map((doc) => ({
      ...doc.toObject(),
      aadhaarFront: doc.aadhaarFront ? baseUrl + doc.aadhaarFront : null,
      aadhaarBack: doc.aadhaarBack ? baseUrl + doc.aadhaarBack : null,
      pan: doc.pan ? baseUrl + doc.pan : null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Error fetching all documents", error });
  }
};
