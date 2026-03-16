import mongoose from "mongoose";

const attendanceCodeSchema = new mongoose.Schema(
  {
    subjectId:   { type: String, required: true },
    subjectName: { type: String, required: true },
    courseId:    { type: String, required: true },  // MongoDB ObjectId (String)
    courseName:  { type: String, required: true },  // "BCA", "MCA" — cron job ke liye
    semester:    { type: Number, required: true },
    code:        { type: String, required: true },
    expiresAt:   { type: Date,   required: true },
    isActive:    { type: Boolean, default: true },
    autoAbsentProcessed: { type: Boolean, default: false },
    usedBy: [
      {
        userId:   String,
        userName: String,
        markedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

attendanceCodeSchema.index({ expiresAt: 1, autoAbsentProcessed: 1 });

export default mongoose.models.AttendanceCode ||
  mongoose.model("AttendanceCode", attendanceCodeSchema);