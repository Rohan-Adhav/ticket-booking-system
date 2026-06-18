import jwt from "jsonwebtoken"
import env from "../config/env.js"
const generateAccessToken = (userId,role)=>{
    let payload = {userId,role}
    let accessToken = jwt.sign(payload,env.JWT_ACCESS_SECRET,{expiresIn:env.ACCESS_EXPIRY})
    return accessToken
}

const generateRefreshToken = (userId)=>{
    let payload = {userId}
    let refreshToken = jwt.sign(payload,env.JWT_REFRESH_SECRET,{expiresIn:env.REFRESH_EXPIRY})
    return refreshToken
}

export {generateAccessToken,generateRefreshToken}