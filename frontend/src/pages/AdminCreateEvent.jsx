import { useState } from "react";
import { createEvent } from "../services/event.api.js";

export default function AdminCreateEvent() {
    const [form, setForm] = useState({
        name: "",
        venue: "",
        dateTime: "",
        totalSeats: 50,
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await createEvent(form);

            setSuccess("Event created successfully.");

            setForm({
                name: "",
                venue: "",
                dateTime: "",
                totalSeats: 50,
            });

            setTimeout(() => {
                setSuccess("");
            }, 4000);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Failed to create event."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] px-4 py-10">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white">
                        Create Event
                    </h1>

                    <p className="mt-2 text-gray-400">
                        Add a new event and automatically generate seats for attendees.
                    </p>
                </div>

                {/* Success */}
                {success && (
                    <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
                        <p className="text-green-400 font-medium">
                            {success}
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="text-red-400 font-medium">
                            {error}
                        </p>
                    </div>
                )}

                {/* Form Card */}
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Event Name */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Event Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Tech Conference 2026"
                                required
                                className="
                                    w-full rounded-xl border border-white/10
                                    bg-black/20 px-4 py-3 text-white
                                    placeholder:text-gray-500
                                    focus:outline-none
                                    focus:ring-2 focus:ring-blue-500
                                    focus:border-blue-500
                                "
                            />
                        </div>

                        {/* Venue */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Venue
                            </label>

                            <input
                                type="text"
                                name="venue"
                                value={form.venue}
                                onChange={handleChange}
                                placeholder="Mumbai Convention Center"
                                required
                                className="
                                    w-full rounded-xl border border-white/10
                                    bg-black/20 px-4 py-3 text-white
                                    placeholder:text-gray-500
                                    focus:outline-none
                                    focus:ring-2 focus:ring-blue-500
                                "
                            />
                        </div>

                        {/* Date & Time */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Event Date & Time
                            </label>

                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={form.dateTime}
                                onChange={handleChange}
                                required
                                className="
                                    w-full rounded-xl border border-white/10
                                    bg-black/20 px-4 py-3 text-white
                                    focus:outline-none
                                    focus:ring-2 focus:ring-blue-500
                                "
                            />
                        </div>

                        {/* Seats */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Total Seats
                            </label>

                            <input
                                type="number"
                                min="1"
                                name="totalSeats"
                                value={form.totalSeats}
                                onChange={handleChange}
                                required
                                className="
                                    w-full rounded-xl border border-white/10
                                    bg-black/20 px-4 py-3 text-white
                                    focus:outline-none
                                    focus:ring-2 focus:ring-blue-500
                                "
                            />

                            <p className="mt-2 text-xs text-gray-500">
                                Seats will be generated automatically after event creation.
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full rounded-xl py-3
                                bg-gradient-to-r
                                from-blue-600 to-purple-600
                                text-white font-semibold
                                transition-all duration-200
                                hover:scale-[1.01]
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading
                                ? "Creating Event..."
                                : "Create Event"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}