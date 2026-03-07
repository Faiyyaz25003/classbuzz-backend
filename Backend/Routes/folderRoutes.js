import express from "express";
import {
  createFolder,
  getFolders,
  deleteFolder,
} from "../Controller/folderController.js";

const router = express.Router();

router.post("/create", createFolder);

router.get("/", getFolders);

router.delete("/:id", deleteFolder);

export default router;