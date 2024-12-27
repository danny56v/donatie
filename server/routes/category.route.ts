import express, { Router } from "express";
import { verifyToken } from "../utils/verifyUser";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../controllers/category.controller";
import { isAdmin } from "../utils/isAdmin";

const router: Router = express.Router();
router.get("/", getCategories);
router.post("/", verifyToken, isAdmin, addCategory);
router.put("/:categoryId", verifyToken, isAdmin, updateCategory);
router.delete("/:categoryId", verifyToken, isAdmin, deleteCategory);

export default router;
