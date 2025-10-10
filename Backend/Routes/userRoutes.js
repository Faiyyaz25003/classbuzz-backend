// routes/userRoutes.js
import express from "express";
import { registerUser, getAllUsers } from "../Controller/userController.js"

const router = express.Router();

// POST => Register new user
router.post("/register", registerUser);

// GET => Get all users
router.get("/", getAllUsers);

export default router;
