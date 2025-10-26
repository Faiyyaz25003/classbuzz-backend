import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  participants: [String],
  category: String,
  time: String,
  description: String,
  remindBefore: Number,
});

export default mongoose.model("Event", eventSchema);
