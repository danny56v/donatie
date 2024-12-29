import express, { Router } from "express";
import { verifyToken } from "../utils/verifyUser";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller";
import { isAdmin } from "../utils/isAdmin";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategory,
  updateSubcategory,
} from "../controllers/subcategory.controller";

const router: Router = express.Router();
router.get("/", getCategories);
router.post("/", verifyToken, isAdmin, createCategory);
router.put("/:categoryId", verifyToken, isAdmin, updateCategory);
router.delete("/:categoryId", verifyToken, isAdmin, deleteCategory);

router.get("/:categoryId/subcategories", getSubcategory);
router.post("/:categoryId/subcategories", verifyToken, isAdmin, createSubcategory);
router.put("/:categoryId/subcategories/:subcategoryId", verifyToken, isAdmin, updateSubcategory);
router.delete("/:categoryId/subcategories/:subcategoryId", verifyToken, isAdmin, deleteSubcategory);

export default router;
