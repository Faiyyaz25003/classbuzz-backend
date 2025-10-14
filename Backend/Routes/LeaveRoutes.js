import express from "express";
import multer from "multer";
import path from "path";
import { submitLeave, getAllLeaves ,   updateLeaveStatus } from "../Controller/LeaveController.js";

const router = express.Router();

// 📁 File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("attachment"), submitLeave);
router.get("/", getAllLeaves);
router.put("/:id", updateLeaveStatus); // ✅ Update leave status (Accept/Reject)


export default router;
