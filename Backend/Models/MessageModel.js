

  import mongoose from "mongoose";

const DeliveredSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ReadBySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    // ── Core ──────────────────────────────────────────────
    text: { type: String, default: "" },
    messageType: {
      type: String,
      enum: ["text", "image", "photo", "file", "document", "voice", "poll"],
      default: "text",
    },
    _tempId: { type: String }, // frontend temp ID for optimistic UI matching

    // ── File / Image ──────────────────────────────────────
    fileUrl: { type: String },
    fileName: { type: String },

    // ── Photo (base64 dataUrl or hosted URL) ──────────────
    photoSrc: { type: String }, // base64 / URL for photo messages

    // ── Document ─────────────────────────────────────────
    docData: {
      name: { type: String },
      size: { type: Number },
      dataUrl: { type: String }, // base64 dataUrl
      mimeType: { type: String },
    },

    // ── Voice ─────────────────────────────────────────────
    voiceData: {
      duration: { type: Number }, // seconds
      // blobUrl is NOT stored — browser-only; store hosted URL if you upload to S3/Cloudinary
      audioUrl: { type: String },
    },

    // ── Poll ──────────────────────────────────────────────
    pollData: {
      question: { type: String },
      options: [{ type: String }],
      allowMultiple: { type: Boolean, default: false },
      votes: { type: mongoose.Schema.Types.Mixed, default: {} }, // { optionIndex: count }
      voters: { type: mongoose.Schema.Types.Mixed, default: {} }, // { userId: [optionIndexes] }
    },

    // ── Status ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    isRead: { type: Boolean, default: false },
    deliveredTo: [DeliveredSchema],
    readBy: [ReadBySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);