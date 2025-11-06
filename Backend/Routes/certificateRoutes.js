import express from "express";
import {
    createCertificate,
    getCertificates,
    deleteCertificate,
} from "../Controller/certificateController.js";

const router = express.Router();

router.post("/", createCertificate); // ✅ Create certificate
router.get("/", getCertificates); // ✅ Get all certificates
router.delete("/:id", deleteCertificate); // ✅ Delete certificate

export default router;
