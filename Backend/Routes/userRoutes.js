
// import express from "express";
// import {
//     getAllUsers,
//     updateUser,
//     toggleBlockUser,
//     registerUser,
//     loginUser,
//     getMe ,


// } from "../Controller/userController.js";

// import { protect } from "../middleware/authMiddleware.js";
// import upload from "../Middleware/upload.js"

// const router = express.Router();

// router.post("/register",
// upload.single("profilePic"), registerUser);
// router.get("/", getAllUsers); // get all users
// router.put("/:id", updateUser); // edit user
// router.patch("/:id/block", toggleBlockUser); // block/unblock user
// router.post("/login", loginUser); // login route
// router.get("/me", protect, getMe);



// export default router;



import express from "express";
import {
  getAllUsers,
  updateUser,
  toggleBlockUser,
  registerUser,
  loginUser,
  getMe,
} from "../Controller/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

// ================= USER REGISTER (WITH PROFILE PHOTO) =================
router.post(
  "/register",
  upload.single("profilePic"),   // profile photo upload
  registerUser
);

// ================= LOGIN =================
router.post("/login", loginUser);

// ================= GET ALL USERS =================
router.get("/", getAllUsers);

// ================= GET CURRENT USER =================
router.get("/me", protect, getMe);

// ================= UPDATE USER =================
router.put("/:id", updateUser);

// ================= BLOCK / UNBLOCK USER =================
router.patch("/:id/block", toggleBlockUser);

export default router;