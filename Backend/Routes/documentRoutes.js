
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  uploadDocuments,
  getAllDocuments,
  deleteDocument,
  deleteUserRecord,
  downloadDocument,
} from "../Controller/documentController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post(
  "/upload",
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  uploadDocuments
);

// ✅ Fetch all uploaded documents
router.get("/", getAllDocuments);

// ✅ Download a specific file (aadhaar/marksheet/photo)
router.get("/download/:id/:field", downloadDocument);

// ✅ Delete a specific file from a user's record
router.delete("/delete/:id/:field", deleteDocument);

// ✅ Delete entire user record + all files
router.delete("/:id", deleteUserRecord);

export default router;
