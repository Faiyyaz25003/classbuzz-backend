import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    aadhar: String,
    marksheet: String,
    photo: String,
    custom: [String],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Document || mongoose.model("Document", documentSchema);