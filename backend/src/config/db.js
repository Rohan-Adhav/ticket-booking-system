import mongoose from "mongoose";
import env from "./env.js";

const connectDb = async()=>{
    try {
        const MONGO_URI = env.MONGO_URI 
         await mongoose.connect(MONGO_URI)
         console.log("Db connected")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

export default connectDb