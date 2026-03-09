import Book from "../Models/bookModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLOR_PALETTE = [
  { color: "#f59e0b", bg: "#fffbeb" },
  { color: "#3b82f6", bg: "#eff6ff" },
  { color: "#10b981", bg: "#ecfdf5" },
  { color: "#ef4444", bg: "#fef2f2" },
  { color: "#8b5cf6", bg: "#f5f3ff" },
  { color: "#06b6d4", bg: "#ecfeff" },
  { color: "#6366f1", bg: "#eef2ff" },
  { color: "#14b8a6", bg: "#f0fdfa" },
  { color: "#f97316", bg: "#fff7ed" },
  { color: "#ec4899", bg: "#fdf2f8" },
];

const getFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// ─── Upload / Create a Book ────────────────────────────────────────
export const uploadBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required (PDF only)",
      });
    }

    const { name, category, course, subject } = req.body;

    if (!name || !category || !course || !subject) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "name, category, course, and subject are required",
      });
    }

    const count = await Book.countDocuments();
    const palette = COLOR_PALETTE[count % COLOR_PALETTE.length];

    const book = await Book.create({
      name,
      category,
      course,
      subject,
      file: req.file.filename,   // ✅ fixed: was pdfFile
      color: palette.color,
      bg: palette.bg,
    });

    res.status(201).json({
      success: true,
      message: "Book uploaded successfully",
      data: {
        ...book.toObject(),
        file: getFileUrl(req, book.file),
      },
    });
  } catch (error) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Books ─────────────────────────────────────────────────
export const getAllBooks = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });

    const formatted = books.map((b) => ({
      ...b.toObject(),
      file: getFileUrl(req, b.file),   // ✅ fixed: was b.pdfFile
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Single Book ───────────────────────────────────────────────
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({
      success: true,
      data: {
        ...book.toObject(),
        file: getFileUrl(req, book.file),   // ✅ fixed: was book.pdfFile
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete a Book ─────────────────────────────────────────────────
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const filePath = path.join(__dirname, "../uploads", book.file);   // ✅ fixed: was book.pdfFile

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await book.deleteOne();

    res.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Categories ────────────────────────────────────────────
export const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct("category", { isActive: true });

    res.json({
      success: true,
      data: ["All", ...categories],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};