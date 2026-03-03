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

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Upload route with proper error handling
router.post(
  "/upload",
  (req, res, next) => {
    upload.fields([
      { name: "aadhar", maxCount: 1 },
      { name: "marksheet", maxCount: 1 },
      { name: "photo", maxCount: 1 },
      { name: "custom", maxCount: 20 },
    ])(req, res, (err) => {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res.status(500).json({ message: "File upload error" });
      }
      next();
    });
  },
  uploadDocuments
);

router.get("/", getAllDocuments);
router.patch("/accept/:id", acceptDocument);
router.patch("/reject/:id", rejectDocument);
router.delete("/:id", deleteDocument);

export default router;