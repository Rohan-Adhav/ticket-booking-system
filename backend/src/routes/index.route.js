import { Router } from "express"
import eventRoutes from "./event.routes.js"
import reservationRoutes from "./reservation.route.js"
import bookingRoutes from "./booking.routes.js"
import authRoutes from "./auth.routes.js"

const router = Router()
router.use("/auth",authRoutes)
router.use("/events", eventRoutes)
router.use("/reserve", reservationRoutes)
router.use("/bookings", bookingRoutes)

export default router