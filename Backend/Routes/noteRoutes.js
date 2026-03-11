import express from "express";
import multer from "multer";
import {
    uploadNotes,
    getAllNotes,
    verifyNotePassword,
    deleteNote,
} from "../Controller/noteController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/upload", upload.any(), uploadNotes);
router.get("/", getAllNotes);
router.post("/verify/:id", verifyNotePassword);
router.delete("/:id", deleteNote);

export default router;