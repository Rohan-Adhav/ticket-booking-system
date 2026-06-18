import env from "./env.js";

const isProd = env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProd, // true only in production (HTTPS)
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export default cookieOptions;