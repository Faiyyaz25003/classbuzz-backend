import Document from "../Models/documentModel.js";

// Save document metadata
export const uploadDocuments = async (req, res) => {
  try {
    const { userId } = req.body;
    const files = req.files;

    if (!userId || !files.aadhaarFront || !files.aadhaarBack || !files.pan) {
      return res.status(400).json({ message: "All documents are required." });
    }

    const newDocument = new Document({
      userId,
      aadhaarFront: files.aadhaarFront[0].path,
      aadhaarBack: files.aadhaarBack[0].path,
      pan: files.pan[0].path,
    });

    await newDocument.save();
    res.status(201).json({ message: "Documents uploaded successfully!", document: newDocument });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get documents by user
export const getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const documents = await Document.find({ userId });
    res.status(200).json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
