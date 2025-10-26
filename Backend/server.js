


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import initializeWebSocket from "./socket/index.js";

// Routes
import userRoutes from "./Routes/userRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import leaveRoutes from "./routes/LeaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";

import taskRoutes from "./Routes/taskRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
import meetingRoutes from "./Routes/meetingRoutes.js";

dotenv.config();
const app = express();

// ================== Middleware ==================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ================== Routes ==================
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/fees", feeRoutes);

app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/meetings", meetingRoutes);

// ================== Server Setup ==================
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeWebSocket(server);

// ================== MongoDB Connection ==================
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Export io for socket usage in other files
export { io };
