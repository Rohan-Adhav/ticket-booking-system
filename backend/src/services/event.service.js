import Event from "../models/event.model.js"
import Seat from "../models/seat.model.js"
import generateSeats from "./seat.services.js"


const createEventService = async (data) => {
    const { name, venue, dateTime, totalSeats } = data

    const event = await Event.create({
        name: name.trim(),
        venue: venue.trim(),
        dateTime,
        totalSeats
    })

    await generateSeats(event._id, totalSeats)

    return event
}

const getAllEventsService = async()=>{
    const events = await Event.find().sort({createdAt:-1})
    return events
}

const getEventByIdService = async(id)=>{
    let event = await Event.findById(id)
    if(!event) return { event: null, seats: [] }
    let seats = await Seat.find({eventId :id}).sort({seatNumber:1})
    return {event,seats}

}

export {createEventService,getAllEventsService,getEventByIdService}