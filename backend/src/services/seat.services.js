import Seat from "../models/seat.model.js"

const generateSeats = async(eventId,totalSeats)=>{
    let seats= []
    for(let i=1;i<=totalSeats;i++){
       seats.push({
        eventId:eventId,
        seatNumber:i,
        status:"available"
       })
    }
    await Seat.deleteMany({eventId})
    await Seat.insertMany(seats)
}

export default generateSeats