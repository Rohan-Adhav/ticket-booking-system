import express from "express"
import router from "./src/routes/index.route.js"
import notFound from "./src/middlewares/notFound.middleware.js"
import errorHandler from "./src/middlewares/errorHandler.js"
import cors from "cors"
import env from "./src/config/env.js"

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    env.FRONTEND_URL
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // mobile/postman support
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json())
app.get("/", (req, res) => {
    res.send("Ticket Booking API is running 🚀");
});
app.use("/api", router)
app.use(notFound)
app.use(errorHandler)

export default app
