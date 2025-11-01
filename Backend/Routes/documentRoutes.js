import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { uploadDocuments, getAllDocuments ,  deleteDocument,
  downloadDocument,} from "../Controller/documentController.js";

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

router.get("/", getAllDocuments);
router.delete("/:id/:field", deleteDocument);
router.get("/download/:id/:field", downloadDocument);

export default router;
