import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    message: String,
    emojis: [{
        name: String,
        role: String
    }]
})

const Message = mongoose.model("message", messageSchema)
export default Message