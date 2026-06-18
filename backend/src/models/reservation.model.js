import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    eventId:{
        type:mongoose.Types.ObjectId,
        ref:"Event",
        required:true

    },
    seatNumbers:{
        type:[Number],
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{timestamps:true})

const Reservation = mongoose.model("Reservation",reservationSchema)

export default Reservation