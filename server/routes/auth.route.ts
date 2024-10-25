import express, { Router } from "express";
import { signup } from "../controllers/auth.controller";

const router: Router = express.Router()

router.get('/signup', signup);

export default router