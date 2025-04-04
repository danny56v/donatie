import express, { Router } from "express";
import { getUser } from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/:id", getUser);

export default router;
