import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "user" ,
        required : [true , "User is required"]
    },
    email : {
        type : String,
        ref : "user" ,
        required : [true , "Email is required"]
    },
    otp : {
        type : String,
        required : [true , "otp is required"]
    }
}, {timestamps : true}
)

const otpModel = mongoose.model("otp" ,  otpSchema)
export default otpModel

