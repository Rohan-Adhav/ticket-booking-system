import { Router } from "express";
import { reserveSeats } from "../controllers/reservation.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"


const router = Router()

router.post("/",authMiddleware,reserveSeats)

export default router