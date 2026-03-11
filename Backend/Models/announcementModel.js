import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: String,

  type: {
    type: String,
    enum: ["Holiday", "Exam", "Workshop", "Seminar", "Notice"]
  },

  department: String,

  file: String,

  startDate: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Announcement", announcementSchema);