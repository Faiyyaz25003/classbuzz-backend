import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  semester: { type: Number, required: true },
  timetable: { type: Array, required: true },
  subjects: { type: Array, required: true },
});

export default mongoose.model("Schedule", scheduleSchema);
