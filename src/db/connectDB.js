import mongoose from "mongoose";
import { database_name } from "../constents.js";


export const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}/${database_name}`)
        console.log("Connected to DB ", connectionInstance.connection.host);
        // console.log("connection instance ", connectionInstance);
        return connectionInstance;
        
    } catch (error) {
        console.log("Failed to connect to DB ", error)
        process.exit(1);
    }
}
