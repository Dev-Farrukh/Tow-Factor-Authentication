import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
    reason: {
      type: String,
      enum: ['logout', 'password_reset', 'refresh'],
      default: 'logout',
    },
  },{
    timestamps: true, 
  }
);

const blackListTokenModel = mongoose.model("blacklistToken" , blacklistTokenSchema)
export default blackListTokenModel