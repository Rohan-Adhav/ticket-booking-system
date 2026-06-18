import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,

    // JWT secrets
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

    // expiry config
    ACCESS_EXPIRY: process.env.ACCESS_EXPIRY || "15m",
    REFRESH_EXPIRY: process.env.REFRESH_EXPIRY || "7d",

    // optional
    NODE_ENV: process.env.NODE_ENV || "development",

    FRONTEND_URL:process.env.FRONTEND_URL
    

};

export default env;