import { useEffect, useState } from "react";
import { getEvents } from "../services/event.api.js";
import { useNavigate } from "react-router-dom";

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents();


                setEvents(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                Loading events...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6">Events 🎟️</h1>

            <div className="grid gap-4">
                {events?.map((event) => (
                    <div
                        key={event._id}
                        onClick={() => navigate(`/event/${event._id}`)}
                        className="p-4 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        <h2 className="text-xl font-semibold">{event.name}</h2>
                        <p className="text-gray-600">{event.venue}</p>
                        <p className="text-sm text-gray-500">{event.dateTime}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}