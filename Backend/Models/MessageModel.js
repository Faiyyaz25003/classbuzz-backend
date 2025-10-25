import mongoose from "mongoose";

const DeliveredSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  at: { type: Date, default: Date.now },
}, { _id: false });

const ReadBySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  at: { type: Date, default: Date.now },
}, { _id: false });

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    text: { type: String, default: "" },
    messageType: { type: String, enum: ["text","image","file","voice","poll"], default: "text" },
    fileUrl: { type: String },
    fileName: { type: String },
    status: { type: String, enum: ["sent","delivered","read"], default: "sent" },
    deliveredTo: [DeliveredSchema],
    readBy: [ReadBySchema],
        isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
