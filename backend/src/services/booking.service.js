import AppError from "../utils/AppError.js";
import Reservation from "../models/reservation.model.js";
import Seat from "../models/seat.model.js";

const createBookingService = async (reservationId) => {

    if (!reservationId) {
        throw new AppError("ReservationId required", 400);
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
        throw new AppError("Reservation not found", 404);
    }

    
    if (reservation.expiresAt < new Date()) {
        throw new AppError("Reservation expired", 410);
    }

    const seatNumbers = reservation.seatNumbers.map(Number);


    const result = await Seat.updateMany(
        {
            eventId: reservation.eventId,
            seatNumber: { $in: seatNumbers },
            status: "reserved"
        },
        {
            $set: { status: "booked" }
        }
    );

    if (result.matchedCount !== seatNumbers.length) {
        throw new AppError("Some seats already booked", 409);
    }


    await Reservation.deleteOne({ _id: reservationId });

    return {
        bookedSeats: seatNumbers,
        eventId: reservation.eventId,
        userId: reservation.userId,
        reservationId
    };
};

export default createBookingService;