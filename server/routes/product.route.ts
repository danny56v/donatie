import express, { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { verifyToken } from "../utils/verifyUser";
import multer from "multer";
const upload = multer()

const router: Router = express.Router();
router.post("/", verifyToken, upload.none(), createProduct);

export default router;
