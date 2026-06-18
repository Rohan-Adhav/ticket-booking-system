import asyncHandler from "../utils/asyncHandler.js"
import AppError from "../utils/AppError.js"
import apiResponse from "../utils/apiResponse.js"
import createBookingService from "../services/booking.service.js"

const createBooking = asyncHandler(async (req, res, next) => {
    const { reservationId } = req.body;

    if (!reservationId) {
        return next(new AppError("ReservationId required", 400));
    }

    const booking = await createBookingService(reservationId);

    return apiResponse(
        res,
        201,
        "Booking confirmed successfully",
        booking
    );
});

export { createBooking }