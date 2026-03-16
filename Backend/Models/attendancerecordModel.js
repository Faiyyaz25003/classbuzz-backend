import mongoose from "mongoose";

/**
 * AttendanceRecord — UPDATED
 * Ab ek student ek subject ek din mein multiple records rakh sakta hai
 * — har code generate ke liye alag record
 * Unique: userId + subjectId + date + codeId
 */

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

    // Har attendance code ka unique ID — isi se pata chalega kis session ka record hai
    codeId:      { type: String, required: true },

    markedAt:    { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ek student + ek subject + ek date + ek codeId = ek record
attendanceRecordSchema.index(
  { userId: 1, subjectId: 1, date: 1, codeId: 1 },
  { unique: true }
);

const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);
export default AttendanceRecord;