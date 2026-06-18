import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    eventId:{
        type:mongoose.Types.ObjectId,
        ref:"Event",
        required:true
    },
    seatNumber:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["available","reserved","booked"],
        required:true
    }

},{timestamps:true})

const Seat = mongoose.model("Seat",seatSchema)

export default Seat