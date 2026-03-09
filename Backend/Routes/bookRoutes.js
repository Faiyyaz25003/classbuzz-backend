import express from "express";
import upload from "../Middleware/upload.middleware.js";
import {
  uploadBook,
  getAllBooks,
  getBookById,
  deleteBook,
  getCategories,
} from "../Controller/bookController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/", getAllBooks);
router.post("/upload", upload.single("file"), uploadBook);
router.get("/:id", getBookById);
router.delete("/:id", deleteBook);

export default router;