import express from "express";
import {
  addFee,
  getAllFees,
  getFeeByUser,
  updateFee,
  deleteFee,
} from "../Controller/feeController.js";

const router = express.Router();

router.post("/", addFee); // Add Fee
router.get("/", getAllFees); // Get All Fees
router.get("/:userId", getFeeByUser); // Get Fee by User
router.put("/:id", updateFee); // Update Fee
router.delete("/:id", deleteFee); // Delete Fee

export default router;
