import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "user" ,
        required : [true , "User is required"],
    },

    refreshToken : {
        type : String,
        required : [true , "Token is required"]
    },
    ip : {
        type : String,
        required : [true , "Can not find ip"]
    },
    userAgent : {
        type : String,
        required : [true , "userAgent is required"]
    },
    revoke : {
        type : Boolean,
        default : false
    }
}, {timestamps : true})

const sessionModel = mongoose.model("session" , sessionSchema)

export default sessionModel