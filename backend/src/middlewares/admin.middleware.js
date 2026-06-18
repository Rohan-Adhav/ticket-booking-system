import AppError from "../utils/AppError.js";

const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return next(new AppError("Forbidden", 403));
    }
    next();
};

export default adminMiddleware;