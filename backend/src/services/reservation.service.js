import Seat from "../models/seat.model.js"
import Reservation from "../models/reservation.model.js"
import AppError from "../utils/AppError.js"

const reserveSeatService = async (data) => {
    let { userId, eventId, seatNumbers } = data


    if (!userId || !eventId || !seatNumbers) {
        throw new AppError("Missing required fields", 400)
    }

    if (!Array.isArray(seatNumbers) || seatNumbers.length <= 0) {
        throw new AppError("seatNumbers must be a non-empty array", 400)
    }


    seatNumbers = seatNumbers.map(Number)

    if (!seatNumbers.every(n => Number.isInteger(n) && n > 0)) {
        throw new AppError("seatNumbers must contain valid positive numbers", 400)
    }


    const existingReservation = await Reservation.findOne({
        userId,
        eventId,
        seatNumbers: { $in: seatNumbers }
    })

    if (existingReservation) {
        throw new AppError("Seats already reserved by user", 409)
    }

    
    const result = await Seat.updateMany(
        {
            eventId,
            seatNumber: { $in: seatNumbers },
            status: "available"
        },
        {
            $set: { status: "reserved" }
        }
    )


    if (result.modifiedCount !== seatNumbers.length) {
        throw new AppError(
            "Seats are no longer available (race condition detected)",
            409
        )
    }

    
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)


    const reservation = await Reservation.create({
        userId,
        eventId,
        seatNumbers,
        expiresAt
    })

    return reservation
}

export default reserveSeatService