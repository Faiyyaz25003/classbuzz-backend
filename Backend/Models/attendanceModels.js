import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["in", "out"],
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "Unknown",
  },
  photo: {
    type: String, // Base64 image string
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Attendance", attendanceSchema);
