import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import env from "../config/env.js";
import apiResponse from "../utils/apiResponse.js";
import cookieOptions from "../config/cookieOptions.js";

const registerUser = asyncHandler(async (req, res, next) => {
    let { name, email, password,role } = req.body;

    if (!name || !email || !password) {
        return next(new AppError("Name, Email & Password are required", 400));
    }

    const cleanname = name.trim();
    const cleanemail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: cleanemail });

    if (userExists) {
        return next(new AppError("User already exists", 409));
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name: cleanname,
        email: cleanemail,
        password: hashedpassword,
        role:role || "user"
    });

    return apiResponse(
        res,
        201,
        "User registered successfully",
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    );
});

const loginUser = asyncHandler(async (req, res, next) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    const cleanemail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanemail }).select("+password");

    if (!user) {
        return next(new AppError("Invalid Credentials", 401));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        return next(new AppError("Invalid Credentials", 401));
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    user.refreshToken = refreshToken;
    await user.save();

    return apiResponse(
        res,
        200,
        "Login successful",
        {
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    );
});


const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return next(new AppError("Unauthorized", 401));
    }

    let decoded;

    try {
        decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch (error) {
        return next(new AppError("Unauthorized", 401));
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
        return next(new AppError("User Not Found", 404));
    }

    if (refreshToken !== user.refreshToken) {
        return next(new AppError("Unauthorized", 401));
    }

    const accessToken = generateAccessToken(user._id, user.role);

    return apiResponse(
        res,
        200,
        "Access token generated successfully",
        {
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        }
    );
});

const logout = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
        userId,
        { refreshToken: null },
        { new: true }
    );

    if (!user) {
        return next(new AppError("User Not Found", 404));
    }

    res.clearCookie("refreshToken", cookieOptions);

    return apiResponse(
        res,
        200,
        "Logged out successfully",
        null
    );
});

export { registerUser, loginUser, refreshAccessToken, logout }