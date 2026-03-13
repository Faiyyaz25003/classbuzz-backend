import express from "express";
import {
    generateCode,
    verifyCodeAndMarkAttendance,
    getActiveCode,
    deactivateCode,
} from "../Controller/attendancecodeController.js";

const router = express.Router();

// POST   /api/attendance-code/generate       → Teacher code generate kare
router.post("/generate", generateCode);

// POST   /api/attendance-code/verify         → Student code verify kare + attendance mark
router.post("/verify", verifyCodeAndMarkAttendance);

// GET    /api/attendance-code/active         → Current active code check karo
router.get("/active", getActiveCode);

// PATCH  /api/attendance-code/deactivate/:id → Teacher manually deactivate kare
router.patch("/deactivate/:id", deactivateCode);

export default router;