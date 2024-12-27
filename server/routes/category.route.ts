import express, { Router } from "express";
import { verifyToken } from "../utils/verifyUser";
import { addCategory, changeCategoryName, deleteCategory } from "../controllers/category.controller";
import { isAdmin } from "../utils/isAdmin";

const router: Router = express.Router();
router.post("/", verifyToken, isAdmin, addCategory);
router.put("/", verifyToken, isAdmin, changeCategoryName);
router.delete("/", verifyToken, isAdmin, deleteCategory);

export default router;
