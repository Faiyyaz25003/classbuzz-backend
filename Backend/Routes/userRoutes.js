

import express from "express";
import { registerUser, getAllUsers, loginUser , getCurrentUser} from "../Controller/userController.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/me", getCurrentUser); 

export default router;
