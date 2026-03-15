import mongoose from "mongoose";

/**
 * AttendanceCode Model
 * ─────────────────────────────────────────────────────────────────
 * autoAbsentProcessed field add kiya gaya hai:
 * → true hone par cron job dobara process nahi karega
 * ─────────────────────────────────────────────────────────────────
 */
const attendanceCodeSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    courseId: { type: String, required: true },
    semester: { type: Number, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    // ── NEW FIELD ──────────────────────────────────────────────
    // Cron job ne is code ke liye auto-absent process kar diya?
    autoAbsentProcessed: { type: Boolean, default: false },
    // ──────────────────────────────────────────────────────────

    usedBy: [
      {
        userId: String,
        userName: String,
        markedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.AttendanceCode ||
  mongoose.model("AttendanceCode", attendanceCodeSchema);