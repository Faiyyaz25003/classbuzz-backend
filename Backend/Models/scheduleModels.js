
import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  semester: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  slotDuration: { type: Number, required: true },
  subjects: [
    {
      name: { type: String, required: true },
      teacher: { type: String },
    },
  ],
  timetable: { type: Array, default: [] }, // Array of days with slots
}, { timestamps: true });

export default mongoose.model("Schedule", timetableSchema);
