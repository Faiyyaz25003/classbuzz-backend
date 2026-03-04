import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    gameType: {
      type: String,
      enum: ["quiz", "puzzle", "trivia", "challenge", "other"],
      default: "other",
    },
    assignedUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        email: { type: String },
        name: { type: String },
        accessPassword: { type: String },
        hasAccessed: { type: Boolean, default: false },
      },
    ],
    createdBy: { type: String, default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
export default Game;