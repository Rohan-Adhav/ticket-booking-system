import asyncHandler from "../utils/asyncHandler.js"
import AppError from "../utils/AppError.js"
import apiResponse from "../utils/apiResponse.js"
import {createEventService,getAllEventsService,getEventByIdService} from "../services/event.service.js"


const createEvent = asyncHandler(async (req, res, next) => {
    let { name, venue, dateTime, totalSeats } = req.body

    if (!name || !venue || !dateTime || !totalSeats) {
        return next(new AppError("All fields are required", 400))
    }

    if (isNaN(totalSeats) || totalSeats <= 0) {
        return next(new AppError("Invalid totalSeats", 400))
    }

    const event = await createEventService({
        name,
        venue,
        dateTime,
        totalSeats: Number(totalSeats)
    })

    return apiResponse(
        res,
        201,
        "Event created successfully",
        {
            event,
            seatsCreated: Number(totalSeats)
        }
    )
})

const getAllEvents = asyncHandler(async(req,res,next)=>{
    const events = await getAllEventsService()

    return apiResponse(
        res,
        200,
        "Events fetched successfully",
        events
    )
})

const getEventById = asyncHandler(async(req,res,next)=>{
    let id = req.params.id
    if(!id){
        return next(new AppError("Id is required",400))
    }
    let {event,seats} = await getEventByIdService(id)

    if(!event){
        return next(new AppError("Event Not Found",404))
    }



    return apiResponse(
        res,
        200,
        "Event fetched",
        {
            event,
            seats
        }
    )
})

export { createEvent,getAllEvents ,getEventById}