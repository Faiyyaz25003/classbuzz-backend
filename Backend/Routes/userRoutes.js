

import express from "express";
import { registerUser, getAllUsers, loginUser } from "../Controller/userController.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);

export default router;
