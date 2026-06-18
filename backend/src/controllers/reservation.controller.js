import reserveSeatService from "../services/reservation.service.js";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const reserveSeats = asyncHandler(async(req,res,next)=>{

    let userId = req.user?._id
    let {eventId,seatNumbers} = req.body

    if(!userId || !eventId || !seatNumbers || seatNumbers.length ===0){
        return next(new AppError("All fields are required",400))
    }

    const reservation = await reserveSeatService({
        userId,
        eventId,
        seatNumbers
    })

    return apiResponse(
        res,
        201,
        "Seats reserved successfully",
        reservation
    )
})

export {reserveSeats}