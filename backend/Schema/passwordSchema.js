import mongoose from "mongoose";
const passwordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const PasswordModel = mongoose.model("PasswordModel", passwordSchema);
export default PasswordModel;