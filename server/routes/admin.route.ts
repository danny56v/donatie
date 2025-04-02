import express, { Router } from "express";
import { verifyToken } from "../middleware/verifyUser";
import { isAdmin } from "../middleware/isAdmin";
import { getAllUsers, deleteUser, getAllProducts, deleteProduct, getStatistics } from "../controllers/admin.controller";

const router: Router = express.Router();

router.get("/allusers", verifyToken, isAdmin, getAllUsers);
router.delete("/user", verifyToken, isAdmin, deleteUser);
router.get("/allproducts", verifyToken, isAdmin, getAllProducts);
router.delete("/product", verifyToken, isAdmin, deleteProduct);

router.get("/statistics", verifyToken, isAdmin, getStatistics);

export default router;
