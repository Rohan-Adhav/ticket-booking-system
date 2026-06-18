import cron from "node-cron";
import releaseExpiredReservations from "../services/reservationCleanup.service.js";

const startReservationCleanupJob = () => {
    console.log("Reservation cleanup cron started...");

    // Runs every 1 minute
    cron.schedule("* * * * *", async () => {
        try {
            await releaseExpiredReservations();
            console.log(" Cleanup executed successfully");
        } catch (err) {
            console.log(" Cleanup error:", err.message);
        }
    });
};

export default startReservationCleanupJob;