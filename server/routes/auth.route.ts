import express, { Router } from "express";
import {   signin, signout, signup } from "../controllers/auth.controller";


const router: Router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/signout', signout)



export default router;
