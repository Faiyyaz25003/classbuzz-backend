
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import initializeWebSocket from "./socket/index.js";

// ================== Routes ==================
import userRoutes from "./Routes/userRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import leaveRoutes from "./routes/LeaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import documentRoutes from "./Routes/documentRoutes.js"
import feeRoutes from "./routes/feeRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
import meetingRoutes from "./Routes/meetingRoutes.js";

dotenv.config();

// ================== Express App ==================
const app = express();

// ================== Middleware ==================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman or local requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ================== Static Folder for Uploads ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// ================== Server & WebSocket Setup ==================
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = initializeWebSocket(server);

// ================== MongoDB Connection ==================
connectDB();

server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// Export io for use in other files
export { io };
