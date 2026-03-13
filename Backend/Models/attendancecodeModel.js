import mongoose from "mongoose";

/**
 * AttendanceCode – Teacher ke dwara generate kiya gaya OTP-style code.
 * Har subject + lecture ke liye ek naya code hota hai.
 * Code sirf 5 minutes ke liye valid hota hai.
 */
const attendanceCodeSchema = new mongoose.Schema(
  {
    // Subject ka naam ya ID (string rakhte hain flexibility ke liye)
    subjectId: {
      type: String,
      required: true,
    },

    subjectName: {
      type: String,
      required: true,
    },

    // Teacher jis course/semester ke liye code generate kar raha hai
    courseId: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    // 6-digit numeric code
    code: {
      type: String,
      required: true,
    },

    // Code kab generate hua
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Code kab expire hoga (default: 5 minutes after creation)
    expiresAt: {
      type: Date,
      required: true,
    },

    // Teacher ne manually band kar diya?
    isActive: {
      type: Boolean,
      default: true,
    },

    // Kitne students ne is code se attendance lagayi
    usedBy: [
      {
        userId: String,
        userName: String,
        markedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Auto-expire index (MongoDB TTL – optional cleanup)
attendanceCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AttendanceCode = mongoose.model("AttendanceCode", attendanceCodeSchema);

export default AttendanceCode;