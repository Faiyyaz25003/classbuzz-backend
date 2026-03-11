import Note from "../Models/noteModel.js";
import crypto from "crypto";

// ================== Upload Notes ==================
export const uploadNotes = async (req, res) => {
  try {
    const { teacherName } = req.body;
    if (!req.files || req.files.length === 0 || !teacherName) {
      return res.status(400).json({ message: "Files or teacher name missing" });
    }

    const uploadedNotes = [];
    for (const file of req.files) {
      const index = file.fieldname.replace("file_", "");
      const noteName = req.body[`name_${index}`] || file.originalname;

      // Random 6-char password generate karo
      const password = crypto.randomBytes(3).toString("hex").toUpperCase();

      const newNote = await Note.create({
        teacherName,
        name: noteName,
        fileUrl: file.path,
        password,
      });
      uploadedNotes.push({ ...newNote._doc, password });
    }

    res.status(201).json({
      message: "Notes Uploaded Successfully",
      data: uploadedNotes,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload Failed" });
  }
};

// ================== Get All Notes ==================
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Fetch Failed" });
  }
};

// ================== Verify Password & Get File URL ==================
export const verifyNotePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.password !== password.trim().toUpperCase()) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ fileUrl: note.fileUrl, name: note.name });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

// ================== Delete Note ==================
export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete Failed" });
  }
};