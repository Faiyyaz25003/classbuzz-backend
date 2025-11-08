


import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // 👈 This is why it's failing when userId is missing
  },
  name: { type: String, required: true },
  aadhaar: String,
  marksheet: String,
  photo: String,
  
  // 🆕 Accept/Reject ke liye fields
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },
  acceptedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);