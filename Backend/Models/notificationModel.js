import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "announcement",
        "exam",
        "holiday",
        "fee",
        "assignment",
        "leave",
        "result",
        "general",
      ],
      default: "general",
    },

    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    // Specific users ko bhejo — ObjectId array
    targetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Sabko bhejo
    targetAll: {
      type: Boolean,
      default: false,
    },

    // Kisne padha
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Kisne delete kiya (soft delete)
    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Optional: detail page ka link
    link: {
      type: String,
      default: null,
    },

    // Optional: expiry date
    expiresAt: {
      type: Date,
      default: null,
    },

    // Kisne banaya (admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;