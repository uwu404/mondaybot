import mongoose from "mongoose"

const serverSchema = new mongoose.Schema({
    id: String,
    rewards: [{
        level: Number,
        role: String
    }]
})

const Server = mongoose.model("server", serverSchema)
export default Server