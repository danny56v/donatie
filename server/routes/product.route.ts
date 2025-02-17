import express, { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getRecommendedProducts,
  getUserProducts,
  pagination,
  updateProduct,
} from "../controllers/product.controller";
import { verifyToken } from "../middleware/verifyUser";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router: Router = express.Router();
router.get("/", getAllProducts);
router.post("/", verifyToken, upload.array("images", 10), createProduct);
router.get("/my-products", verifyToken, getUserProducts);

router.get("/recommended/:subcategoryId/:productId", getRecommendedProducts);

router.get("/pagination", pagination);

router.get("/:id", getProductById);
router.put("/:id", verifyToken, updateProduct);


export default router;
