import express from "express";
import multer from "multer";
import {
  uploadDocuments,
  getAllDocuments,
  acceptDocument,
  rejectDocument,
  deleteDocument,
} from "../Controller/documentController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ upload.any() sahi hai — dynamic field names ke liye
router.post("/upload", upload.any(), uploadDocuments);

router.get("/", getAllDocuments);
router.put("/accept/:id", acceptDocument);
router.put("/reject/:id", rejectDocument);
router.delete("/:id", deleteDocument);

export default router;