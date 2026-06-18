import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true,
        minlength:6
    },
    venue:{
        type:String,
        required:true
    },
    dateTime:{
        type:Date,
        required:true
    },
    totalSeats:{
        type:Number,
        required:true
    }

},{timestamps:true})

const Event = mongoose.model("Event",eventSchema)

export default Event