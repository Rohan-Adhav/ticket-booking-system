import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { reserveSeats } from "../services/reservation.api.js";
import { confirmBooking } from "../services/booking.api.js";
import { getEventById } from "../services/event.api.js";

export default function EventDetails() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservationId, setReservationId] = useState(null);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const clearMessages = () => {
        setTimeout(() => {
            setError("");
            setSuccess("");
        }, 3000);
    };

    const fetchEvent = async () => {
        try {
            const data = await getEventById(id)

            setEvent(data.event);
            setSeats(data.seats);
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                "Failed to load event details."
            );
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEvent();
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setReservationId(null);
                    setSuccess("");
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const toggleSeat = (seat) => {
        if (seat.status !== "available") return;

        setSelectedSeats((prev) => {
            const exists = prev.find((s) => s._id === seat._id);

            if (exists) {
                return prev.filter((s) => s._id !== seat._id);
            }

            return [...prev, seat];
        });
    };

    const handleReserve = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            if (selectedSeats.length === 0) {
                setError("Please select at least one seat.");
                return;
            }

            const seatNumbers = selectedSeats.map(
                (seat) => seat.seatNumber
            );

            const response = await reserveSeats(id, seatNumbers);

            const reservation = response

            if (!reservation?._id) {
                throw new Error("Invalid reservation response");
            }

            setReservationId(reservation._id);

            const expiryTime = new Date(
                reservation.expiresAt
            ).getTime();

            const remainingSeconds = Math.max(
                0,
                Math.floor((expiryTime - Date.now()) / 1000)
            );

            setTimer(remainingSeconds);
            setSelectedSeats([]);
            setSuccess("Seats reserved successfully.");
            clearMessages();

            await fetchEvent();
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to reserve seats."
            );
            clearMessages();
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            if (!reservationId) {
                setError("No active reservation found.");
                return;
            }

            await confirmBooking(reservationId);

            setReservationId(null);
            setSelectedSeats([]);
            setTimer(0);
            setSuccess("Booking completed successfully.");
            clearMessages();

            await fetchEvent();
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to confirm booking."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

    const getSeatColor = (seat) => {
        if (seat.status === "booked") return "bg-red-600";
        if (seat.status === "reserved") return "bg-orange-500";

        if (selectedSeats.some((s) => s._id === seat._id)) {
            return "bg-blue-600";
        }

        return "bg-green-500";
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{event?.name}</h1>

            {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    {success}
                </div>
            )}

            {timer > 0 && (
                <div className="mb-4 rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-orange-700 font-medium">
                    Reservation expires in: {formatTime(timer)}
                </div>
            )}

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-6">
                {seats.map((seat) => (
                    <button
                        key={seat._id}
                        onClick={() => toggleSeat(seat)}
                        className={`h-10 w-10 rounded text-white text-sm font-medium transition ${getSeatColor(
                            seat
                        )}`}
                    >
                        {seat.seatNumber}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
                <button
                    onClick={handleReserve}
                    disabled={loading || selectedSeats.length === 0}
                    className="rounded bg-black px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Reserve Seats"}
                </button>

                <button
                    onClick={handleBooking}
                    disabled={loading || !reservationId}
                    className="rounded bg-green-600 px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Confirm Booking"}
                </button>
            </div>
        </div>
    );
}