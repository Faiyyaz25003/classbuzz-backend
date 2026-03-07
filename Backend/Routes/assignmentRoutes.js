import express from "express";

import {
    uploadAssignment,
    getAssignmentsByFolder,
    verifyAssignment,
    rejectAssignment,
} from "../Controller/assignmentController.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadAssignment);

router.get("/folder/:folderId", getAssignmentsByFolder);

router.put("/verify/:id", verifyAssignment);

router.put("/reject/:id", rejectAssignment);

export default router;