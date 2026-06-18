import { Router } from "express";
import { createEvent, getAllEvents ,getEventById} from "../controllers/event.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"
import adminMiddleware from "../middlewares/admin.middleware.js";


const router = Router()

router.post("/",authMiddleware,adminMiddleware,createEvent)
router.get("/",getAllEvents)
router.get("/:id",getEventById)

export default router