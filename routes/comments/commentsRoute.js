import express from "express";
import {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} from "../../controllers/comments/commentCtrl.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";

const route = express.Router();

route.post("/", authMiddleware, createCommentCtrl);
route.get("/", fetchAllCommentsCtrl);
route.get("/:id", authMiddleware, fetchCommentCtrl);
route.put("/:id", authMiddleware, updateCommentCtrl);
route.delete("/:id", authMiddleware, deleteCommentCtrl);

export default route;
