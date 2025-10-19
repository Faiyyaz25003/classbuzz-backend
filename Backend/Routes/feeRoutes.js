import express from "express";
import {
  addFee,
//   getAllFees,
//   getFeeByUser,
//   updateFee,
//   deleteFee,
} from "../Controller/feeController.js";

const router = express.Router();

router.post("/", addFee); // Add new fee
// router.get("/", getAllFees); // Get all fee records
// router.get("/user/:userId", getFeeByUser); // Get fee records by user
// router.put("/:id", updateFee); // Update fee record
// router.delete("/:id", deleteFee); // Delete fee record

export default router;
