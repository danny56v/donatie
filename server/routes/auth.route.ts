import express, { Router } from "express";
import {   signin, signout, signup, checkAuth } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyUser";


const router: Router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/signout', signout)
router.get('/checkAuth', verifyToken, checkAuth)



export default router;
