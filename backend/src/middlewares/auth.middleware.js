import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import env from "../config/env.js"
import AppError from "../utils/AppError.js"
import User from "../models/user.model.js"
const authMiddleware = asyncHandler(async (req, res, next) => {
    let header = req.headers.authorization

    if (!header || !header.startsWith("Bearer ")) {
        return next(new AppError("Unauthorized", 401))
    }

    let token = header.split(" ")[1]

    let decoded;

    try {
        decoded = jwt.verify(token,env.JWT_ACCESS_SECRET)
        
    } catch (error) {
        return next(new AppError("Unauthorized",401))
    }

    if (!decoded?.userId) {
    return next(new AppError("Unauthorized", 401));
}

    let user = await User.findById(decoded.userId)

    if(!user){
        return next(new AppError("Unauthorized",401))
    }

    req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    next()
})

export default authMiddleware