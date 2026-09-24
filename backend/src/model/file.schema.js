import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true 
    },
    size: {
        type: Number,
        required: true 
    }
}, {
    timestamps: true 
});

const fileModel = mongoose.model("file", fileSchema);

export default fileModel;