import express from "express";
import {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCateoryCtrl,
} from "../../controllers/category/categoryCtrl.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";
const route = express.Router();

route.post("/", authMiddleware, createCategoryCtrl);
route.get("/", fetchCategoriesCtrl);
route.get("/:id", fetchCategoryCtrl);
route.put("/:id", authMiddleware, updateCategoryCtrl);
route.delete("/:id", authMiddleware, deleteCateoryCtrl);

export default route;
