import express from "express";
import multer from "multer";
import { uploadDocuments, getUserDocuments } from "../Controller/documentController.js";

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/*
  Upload documents:
  - Expecting fields: aadhaarFront, aadhaarBack, pan
*/
router.post(
  "/upload",
  upload.fields([
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "pan", maxCount: 1 },
  ]),
  uploadDocuments
);

// Get documents for a user
router.get("/:userId", getUserDocuments);

export default router;
