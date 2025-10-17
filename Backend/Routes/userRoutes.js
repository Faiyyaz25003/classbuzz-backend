
import express from "express";
import {
    getAllUsers,
    updateUser,
    toggleBlockUser,
    loginUser,
} from "../Controller/userController.js";

const router = express.Router();

router.get("/", getAllUsers); // get all users
router.put("/:id", updateUser); // edit user
router.patch("/:id/block", toggleBlockUser); // block/unblock user
router.post("/login", loginUser); // login route

export default router;
