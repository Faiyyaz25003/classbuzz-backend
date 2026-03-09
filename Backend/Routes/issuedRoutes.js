import express from "express";
import {
  issueBook,
  getAllIssued,
  getMyBooks,
  getExpiringBooks,
  returnBook,
  getStats,
} from "../Controller/issuedController.js";

const router = express.Router();

router.get("/stats", getStats);
router.get("/my-books", getMyBooks);
router.get("/expiring", getExpiringBooks);
router.get("/", getAllIssued);
router.post("/", issueBook);
router.patch("/:id/return", returnBook);

export default router;