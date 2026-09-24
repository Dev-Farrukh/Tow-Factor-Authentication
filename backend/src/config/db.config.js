import mongoose from "mongoose";
import envVariables from "./env.config.js";

const dbConfig = async () => {
    try {
        await mongoose.connect(envVariables.MONGO_URI)
        console.log("Database connnected");
        
    } catch (error) {
        throw new Error(`Error while connecting ${error.message} `, { cause: error });
        
    }
}

export default dbConfig