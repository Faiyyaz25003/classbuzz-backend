import Document from "../Models/documentModel.js";

export const uploadDocuments = async (req, res) => {
  try {
    const { name } = req.body;
    const files = req.files;

    const newDoc = new Document({
      name,
      aadhaar: files.aadhaar ? files.aadhaar[0].path : null,
      marksheet: files.marksheet ? files.marksheet[0].path : null,
      photo: files.photo ? files.photo[0].path : null,
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


// ✅ Delete a single field (aadhaar, marksheet, photo)
export const deleteDocument = async (req, res) => {
  try {
    const { id, field } = req.params;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const filePath = doc[field];
    if (filePath) {
      const fullPath = path.join(__dirname, "../uploads", path.basename(filePath));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    doc[field] = null;
    await doc.save();
    res.json({ message: `${field} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error deleting document" });
  }
};

// ✅ Delete entire user record
export const deleteUserRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "User not found" });

    const files = [doc.aadhaar, doc.marksheet, doc.photo].filter(Boolean);
    for (const file of files) {
      const fullPath = path.join(__dirname, "../uploads", path.basename(file));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await Document.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user record" });
  }
};

// ✅ Download document
export const downloadDocument = async (req, res) => {
  try {
    const { id, field } = req.params;
    const doc = await Document.findById(id);
    if (!doc || !doc[field]) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(__dirname, "../uploads", path.basename(doc[field]));
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Error downloading file" });
  }
};