import express, { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { verifyToken } from "../utils/verifyUser";

const router: Router = express.Router();
router.post("/", verifyToken, createProduct);

export default router;
