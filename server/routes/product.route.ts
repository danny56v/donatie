import express, { Router } from "express";
import { createProduct, getAllProducts } from "../controllers/product.controller";
import { verifyToken } from "../middleware/verifyUser";
import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const router: Router = express.Router();
router.get("/", getAllProducts)
router.post("/", verifyToken, upload.array("images", 5), createProduct);

export default router;
