

import express from "express";
import multer from "multer";
import { submitLeave, getAllLeaves, updateLeaveStatus, deleteLeave } from "../Controller/LeaveController.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("attachment"), submitLeave);
router.get("/", getAllLeaves);
router.put("/:id", updateLeaveStatus);
router.delete("/:id", deleteLeave);

export default router;
