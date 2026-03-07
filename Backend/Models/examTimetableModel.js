import mongoose from "mongoose";

const timetableRowSchema = new mongoose.Schema({
  subject: String,
  date: String,
  time: String,
  room: String,
});

const examTimetableSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    semester: {
      type: String,
      required: true,
    },

    timetable: [timetableRowSchema],
  },
  { timestamps: true },
);

export default mongoose.model("ExamTimetable", examTimetableSchema);