import express from "express";
import adminUpload from "../Middleware/adminUpload.js";
import {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getMeAdmin,
} from "../Controller/adminController.js"
import { protectAdmin } from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllAdmins);
router.post("/register", adminUpload.single("profileImage"), registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getMeAdmin);

export default router;