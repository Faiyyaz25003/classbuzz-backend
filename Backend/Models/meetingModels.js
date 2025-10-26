import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: String,
  date: String,
  participants: [String],
  startTime: String,
  endTime: String,
  description: String,
});

export default mongoose.model("Meeting", meetingSchema);
