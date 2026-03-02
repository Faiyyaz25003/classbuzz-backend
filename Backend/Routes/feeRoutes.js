import express from "express";
import {
  addFee,
  getAllFees,
  getFeesByUser,
  updateFee,
  deleteFee,
  getUserFees,
} from "../Controller/feeController.js";

const router = express.Router();

// ✅ Specific routes PEHLE rakhein — warna /:id inhe catch kar leta hai
router.post("/add", addFee);
router.get("/", getAllFees);
router.get("/user/:userId", getFeesByUser);       // ✅ Yeh /:id se UPAR hona chahiye
router.get("/user-alt/:userId", getUserFees);

// ✅ Generic :id routes BAAD mein
router.put("/:id", updateFee);
router.delete("/:id", deleteFee);

export default router;