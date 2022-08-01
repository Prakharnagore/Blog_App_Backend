import express from "express";
import {
  deleteUserCtrl,
  fetchUserCtrl,
  fetchUserDetailsCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  userLoginCtrl,
  userProfileCtrl,
  userRegisterCtrl,
} from "../../controllers/users/usersCtrl.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";
const route = express.Router();

route.post("/register", userRegisterCtrl);
route.post("/login", userLoginCtrl);
route.get("/", authMiddleware, fetchUserCtrl);
route.get("/profile/:id", authMiddleware, userProfileCtrl);
route.put("/", authMiddleware, updateUserCtrl);
route.put("/password", authMiddleware, updateUserPasswordCtrl);
route.delete("/:id", deleteUserCtrl);
route.get("/:id", fetchUserDetailsCtrl);

export default route;
