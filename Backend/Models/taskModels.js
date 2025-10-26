import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  date: String,
  participants: [String],
  time: String,
  description: String,
});

export default mongoose.model("Task", taskSchema);
