

import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    aadhaarFront: { type: String },
    aadhaarBack: { type: String },
    pan: { type: String },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
