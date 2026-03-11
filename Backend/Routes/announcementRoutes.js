import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
} from "../Controller/announcementController.js"

import uploadAnnouncement from "../Middleware/uploadAnnouncement.js";

const router = express.Router();

router.post(
  "/create",
  uploadAnnouncement.single("file"),
  createAnnouncement
);

router.get("/all", getAnnouncements);

router.put(
  "/update/:id",
  uploadAnnouncement.single("file"),
  updateAnnouncement
);

router.delete("/delete/:id", deleteAnnouncement);

export default router;