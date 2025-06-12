import express, { Router } from "express";
import { verifyToken } from "../middleware/verifyUser";
import { isAdmin } from "../middleware/isAdmin";
import { getAllUsers, deleteUser, getAllProducts, deleteProduct, getStatistics } from "../controllers/admin.controller";
import { blockUser, blockUserFor30Days, unblockUser } from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/allusers", verifyToken, isAdmin, getAllUsers);
router.delete("/user/:id", verifyToken, isAdmin, deleteUser);
router.get("/allproducts", verifyToken, isAdmin, getAllProducts);
router.delete("/product", verifyToken, isAdmin, deleteProduct);

router.put("/block-user/:id", verifyToken, isAdmin, blockUser);
router.put("/block-for-30-days/:id", verifyToken, isAdmin, blockUserFor30Days);
router.put("/unblock/:id", verifyToken, isAdmin, unblockUser);

router.get("/statistics", verifyToken, isAdmin, getStatistics);

export default router;
