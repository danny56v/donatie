import express, { Router } from "express";
import { blockUser, blockUserFor30Days, getUser, unblockUser } from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyUser";
import { isAdmin } from "../middleware/isAdmin";

const router: Router = express.Router();

router.get("/:id", getUser);


export default router;
