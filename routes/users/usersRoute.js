import express from "express";
import {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
} from "../../controllers/users/usersCtrl.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";
import {
  profilePhotoResize,
  photoUpload,
} from "../../middlewares/upload/photoUpload.js";

const route = express.Router();

route.post("/register", userRegisterCtrl);
route.post("/login", loginUserCtrl);
route.put(
  "/profilephoto-upload",
  authMiddleware,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUploadCtrl
);
route.get("/", authMiddleware, fetchUsersCtrl);
route.post("/forget-password-token", forgetPasswordToken);
route.put("/reset-password", passwordResetCtrl);
route.put("/password", authMiddleware, updateUserPasswordCtrl);
route.put("/follow", authMiddleware, followingUserCtrl);
route.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenCtrl
);

route.put("/verify-account", authMiddleware, accountVerificationCtrl);
route.put("/unfollow", authMiddleware, unfollowUserCtrl);
route.put("/block-user/:id", authMiddleware, blockUserCtrl);
route.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);
route.get("/profile/:id", authMiddleware, userProfileCtrl);
route.put("/", authMiddleware, updateUserCtrl);
route.delete("/:id", deleteUsersCtrl);
route.get("/:id", fetchUserDetailsCtrl);

export default route;
