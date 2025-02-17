import express, { Router } from "express";
import { signin, signout, signup, checkAuth, restrictAuthRoutes } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyUser";

const router: Router = express.Router();

router.post("/signup",  restrictAuthRoutes, signup);
router.post("/signin", restrictAuthRoutes, signin);
router.post("/signout", signout);
router.get("/checkAuth", verifyToken, checkAuth);

export default router;
