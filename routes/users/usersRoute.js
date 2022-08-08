import express from "express";
import {
  accountVerificationCtrl,
  blockUserCtrl,
  deleteUserCtrl,
  fetchUserCtrl,
  fetchUserDetailsCtrl,
  followingUserCtrl,
  generateVerificationTokenCtrl,
  unBlockUserCtrl,
  unfollowUserCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  userLoginCtrl,
  userProfileCtrl,
  userRegisterCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
} from "../../controllers/users/usersCtrl.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";
import {
  profilePhotoUpload,
  profilePhotoResize,
} from "../../middlewares/upload/profilePhotoUpload.js";

const route = express.Router();

route.post("/register", userRegisterCtrl);
route.post("/login", userLoginCtrl);
route.put(
  "/profilephoto-upload",
  authMiddleware,
  profilePhotoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUploadCtrl
);

route.get("/", authMiddleware, fetchUserCtrl);
route.get("/profile/:id", authMiddleware, userProfileCtrl);
route.put("/follow", authMiddleware, followingUserCtrl);
route.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenCtrl
);
route.put("/verify-account/:token", accountVerificationCtrl);
route.put("/unfollow", authMiddleware, unfollowUserCtrl);
route.put("/password", authMiddleware, updateUserPasswordCtrl);
route.post("/forget-password-token", forgetPasswordToken);
route.post("/reset-password/:token", passwordResetCtrl);
route.put("/block-user/:id", authMiddleware, blockUserCtrl);
route.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);
route.put("/:id", authMiddleware, updateUserCtrl);
route.delete("/:id", deleteUserCtrl);
route.get("/:id", fetchUserDetailsCtrl);

export default route;
