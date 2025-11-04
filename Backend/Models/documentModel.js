


import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This is the model name of your User schema
    required: true,
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