

import express from "express";
import {
  addFee,
  getAllFees,
  getFeesByUser, // ✅ use correct name from controller
  updateFee,
  deleteFee,
  getUserFees // optional, but use different path if you need it
} from "../Controller/feeController.js";

const router = express.Router();

// Add Fee
router.post("/", addFee);

// Get All Fees
router.get("/", getAllFees);

// Get Fees by User
router.get("/user/:userId", getFeesByUser); // ✅ changed path to avoid conflict

// Optional: alternative fetch by user
router.get("/user-alt/:userId", getUserFees); // use only if needed, different path

// Update Fee
router.put("/:id", updateFee);

// Delete Fee
router.delete("/:id", deleteFee);

export default router;
