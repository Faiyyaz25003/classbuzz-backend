// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import userRoutes from "./Routes/userRoutes.js";
// import leaveRoutes from "./Routes/LeaveRoutes.js";
// import attendanceRoutes from "./Routes/attendanceRoutes.js";
// import documentRoutes from "./Routes/documentRoutes.js";
// import feeRoutes from "./Routes/feeRoutes.js";


// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/leave", leaveRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/documents", documentRoutes);
// app.use("/api/fees", feeRoutes);

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB connection error:", err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import initializeWebSocket from "./socket/index.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import leaveRoutes from "./routes/LeaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";

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
