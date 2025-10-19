import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // user identifier
  aadhaarFront: { type: String, required: true },
  aadhaarBack: { type: String, required: true },
  pan: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
