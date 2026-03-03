

import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    // ✅ NEW: Admin ka rejection reason store karne ke liye
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);