import express, { Router } from "express";
import { signin, signout, signup, checkAuth, restrictAuthRoutes, googleAuth } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyUser";
import passport from "passport";

const router: Router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/signin" }),
  googleAuth
);

router.post("/signup", restrictAuthRoutes, signup);
router.post("/signin", restrictAuthRoutes, signin);
router.post("/signout", signout);
router.get("/checkAuth", verifyToken, checkAuth);

export default router;
