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
import { cancelRezervation, confirmDonation, getDonations, reserveProduct } from "../controllers/donation.controller";
import { isBlocked } from "../middleware/isBlocked";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router: Router = express.Router();
// All Products
router.get("/", getAllProducts);

// Create Product
router.post("/", verifyToken, isBlocked, upload.array("images", 10), createProduct);

// Get User Products
router.get("/user-products", verifyToken, isBlocked, getUserProducts);

// Get Recommended Products
router.get("/recommended/:subcategoryId/:productId", getRecommendedProducts);

//Rezervare produs
router.put("/:id/reserve", verifyToken, isBlocked, reserveProduct);

//Confirmare donatie
router.put("/:id/confirm", verifyToken, isBlocked, confirmDonation);

//Get donarions
router.get("/donations", verifyToken, isBlocked, getDonations);

//Anulare rezervare
router.put("/:id/cancel", verifyToken, isBlocked, cancelRezervation);

// Pagination
router.get("/pagination", pagination);

// User Products Pagination
router.get("/user-products/:userId/pagination", verifyToken, isBlocked, userProductsPagination);

// Delete Product
router.delete("/:id", verifyToken, isBlocked, deleteProduct);

// Get Product By Id
router.get("/:id", getProductById);

// Update Product
router.put("/:id", verifyToken, isBlocked, upload.array("images", 10), updateProduct);

export default router;
