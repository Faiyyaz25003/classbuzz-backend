import mongoose from "mongoose";

// Purana cached model delete karo
delete mongoose.models.AttendanceCode;

const attendanceCodeSchema = new mongoose.Schema(
  {
    subjectId:   { type: String, required: true },
    subjectName: { type: String, required: true },
    courseId:    { type: String, required: true },
    courseName:  { type: String, default: "" },  // required nahi — purane docs crash na karein
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

// delete mongoose.models cache ke baad fresh model banao
const AttendanceCode = mongoose.model("AttendanceCode", attendanceCodeSchema);

export default AttendanceCode;

// import mongoose from "mongoose";

// const attendanceCodeSchema = new mongoose.Schema(
//   {
//     subjectId:   { type: String, required: true },
//     subjectName: { type: String, required: true },
//     courseId:    { type: String, required: true },  // MongoDB ObjectId (String)
//     courseName:  { type: String, required: true },  // "BCA", "MCA" — cron job ke liye
//     semester:    { type: Number, required: true },
//     code:        { type: String, required: true },
//     expiresAt:   { type: Date,   required: true },
//     isActive:    { type: Boolean, default: true },
//     autoAbsentProcessed: { type: Boolean, default: false },
//     usedBy: [
//       {
//         userId:   String,
//         userName: String,
//         markedAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// attendanceCodeSchema.index({ expiresAt: 1, autoAbsentProcessed: 1 });

// export default mongoose.models.AttendanceCode ||
//   mongoose.model("AttendanceCode", attendanceCodeSchema);