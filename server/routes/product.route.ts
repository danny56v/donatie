import express, { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getRecommendedProducts,
  getUserProducts,
  pagination,
  updateProduct,
  userProductsPagination,
} from "../controllers/product.controller";
import { verifyToken } from "../middleware/verifyUser";
import multer from "multer";
import { cancelRezervation, confirmDonation, reserveProduct } from "../controllers/donation.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router: Router = express.Router();
// All Products
router.get("/", getAllProducts);

// Create Product
router.post("/", verifyToken, upload.array("images", 10), createProduct);

// Get User Products
router.get("/user-products", verifyToken, getUserProducts);

// Get Recommended Products
router.get("/recommended/:subcategoryId/:productId", getRecommendedProducts);

//Rezervare produs
router.put("/:id/reserve", verifyToken, reserveProduct);

//Confirmare donatie
router.put("/:id/confirm", verifyToken, confirmDonation);

//Anulare rezervare
router.put("/:id/cancel", verifyToken, cancelRezervation);

// Pagination
router.get("/pagination", pagination);

// User Products Pagination
router.get("/user-products/:userId/pagination", verifyToken, userProductsPagination);

// Delete Product
router.delete("/:id", verifyToken, deleteProduct);

// Get Product By Id
router.get("/:id", getProductById);

// Update Product
router.put("/:id", verifyToken, upload.array("images", 10), updateProduct);

export default router;
