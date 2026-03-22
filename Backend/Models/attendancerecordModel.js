import mongoose from "mongoose";

/**
 * AttendanceRecord — UPDATED
 * Unique: userId + subjectId + codeId
 * Ek student ek code ke liye sirf ek record
 * Ek din mein multiple codes = multiple records
 */

// Cache clear karo
delete mongoose.models.AttendanceRecord;

const attendanceRecordSchema = new mongoose.Schema(
  {
    userId:      { type: String, required: true },
    userName:    { type: String, required: true },
    subjectId:   { type: String, required: true },
    subjectName: { type: String, required: true },
    courseId:    { type: String, required: true },
    semester:    { type: Number, required: true },
    date:        { type: String, required: true },
    status:      { type: String, enum: ["Present", "Absent"], required: true },
    codeUsed:    { type: String, default: "—" },
    codeId:      { type: String, required: true }, // Har code session ka unique ID
    markedAt:    { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Unique: ek student + ek subject + ek codeId = ek record
attendanceRecordSchema.index(
  { userId: 1, subjectId: 1, codeId: 1 },
  { unique: true }
);

const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);
export default AttendanceRecord;