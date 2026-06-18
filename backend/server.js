import express from "express"
import env from "./src/config/env.js"
import connectDb from "./src/config/db.js"
import app from "./app.js"
import startReservationCleanupJob from "./src/jobs/reservationCleanup.job.js";


const PORT = env.PORT

const startServer = async () => {
    try {
        await connectDb()
        startReservationCleanupJob();


        app.listen(PORT, () => {
            console.log(`Server Listening: http://localhost:${PORT} `)
        })
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }

}


startServer()