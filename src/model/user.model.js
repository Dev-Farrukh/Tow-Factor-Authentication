import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String ,
        required : [true , "Username is required"],
        unique : [true , "Username must be unique"]
    },
    email : {
        type : String ,
        required : [true , "Email is required"],
        unique : [true , "Email must be unique"]
    },
    password : {
        type : String ,
        required : [true , "Password is required"],
    },
    verified : {
        type : Boolean,
        default : false
    }
})

const userModel = mongoose.model("user" , userSchema)
export default userModel