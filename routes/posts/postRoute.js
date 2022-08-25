import express from "express";
import {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleAddLikeToPostCtrl,
  toggleAddDislikeToPostCtrl,
} from "../../controllers/posts/postCtrl.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";

import {
  photoUpload,
  postImgResize,
} from "../../middlewares/upload/photoUpload.js";
const route = express.Router();

route.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postImgResize,
  createPostCtrl
);

route.put("/likes", authMiddleware, toggleAddLikeToPostCtrl);
route.put("/dislikes", authMiddleware, toggleAddDislikeToPostCtrl);
route.get("/", fetchPostsCtrl);
route.get("/:id", fetchPostCtrl);
route.put("/:id", authMiddleware, updatePostCtrl);
route.delete("/:id", authMiddleware, deletePostCtrl);

export default route;
