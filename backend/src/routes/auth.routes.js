import { Router } from "express";
import {registerUser,loginUser,refreshAccessToken,logout} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/refreshAccessToken",refreshAccessToken)
router.post("/logout",authMiddleware,logout)

export default router;