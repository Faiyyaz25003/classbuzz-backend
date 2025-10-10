// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // ✅ IMPORT CORS
import userRoutes from "./Routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// ✅ Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:3000", // your Next.js frontend URL
  credentials: true,
}));

// Routes
app.use("/api/users", userRoutes);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
