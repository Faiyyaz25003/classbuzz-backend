import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhaar: String,
  marksheet: String,
  photo: String,
});

export default mongoose.model("Document", documentSchema);
