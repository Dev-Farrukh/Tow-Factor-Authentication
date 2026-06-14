import mongoose from "mongoose";
import config from "./config.js";

const dbConfiguration = async () => {
    try {
        await mongoose.connect(config.DB_URI)
        console.log("Database connected successfully");
        
    } catch (error) {
        console.log("Error while connecting with database" , error);
        
    }
}

export default dbConfiguration