import Reservation from "../models/reservation.model.js";
import Seat from "../models/seat.model.js";

const releaseExpiredReservations = async () => {
    const expired = await Reservation.find({
        expiresAt: { $lt: new Date() }
    });
    console.log("Expired reservations found:", expired.length);
    if (expired.length === 0) return;

    for (const r of expired) {
        try {
            const result = await Seat.updateMany(
                {
                    eventId: r.eventId,
                    seatNumber: { $in: r.seatNumbers },
                    status: "reserved"
                },
                {
                    $set: { status: "available" }
                }
            );

            console.log(
                `Released ${result.modifiedCount} seat(s) for reservation ${r._id}`
            );

            await Reservation.deleteOne({ _id: r._id });

            console.log(`Deleted reservation ${r._id}`);

        } catch (err) {
            console.log("Failed cleanup for reservation:", r._id, err.message);
        }
    }
};

export default releaseExpiredReservations;