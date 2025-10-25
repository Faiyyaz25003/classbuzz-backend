
import express from "express";
import {
    getAllUsers,
    updateUser,
    toggleBlockUser,
    registerUser,
    loginUser,
    getUsers,
    createUser,

} from "../Controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/", getAllUsers); // get all users
router.put("/:id", updateUser); // edit user
router.patch("/:id/block", toggleBlockUser); // block/unblock user
router.post("/login", loginUser); // login route


router.get("/", getUsers);
router.post("/", createUser);

export default router;
