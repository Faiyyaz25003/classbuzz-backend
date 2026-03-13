import mongoose from "mongoose";

/**
 * AttendanceRecord – Har student ka har subject ke liye daily record.
 * Ek student + ek subject + ek date = ek record.
 */
const attendanceRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    subjectId: {
      type: String,
      required: true,
    },

    subjectName: {
      type: String,
      required: true,
    },

    courseId: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    // Date of lecture (YYYY-MM-DD format)
    date: {
      type: String,
      required: true,
    },

    // "Present" ya "Absent"
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },

    // Konsa code use kiya (agar Present hai toh)
    codeUsed: {
      type: String,
      default: "—",
    },

    // Exact time jab attendance lagi
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ek student ek subject ek date par sirf ek baar attendance laga sake
attendanceRecordSchema.index(
  { userId: 1, subjectId: 1, date: 1 },
  { unique: true }
);

const AttendanceRecord = mongoose.model(
  "AttendanceRecord",
  attendanceRecordSchema
);

export default AttendanceRecord;