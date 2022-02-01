import mongoose from "mongoose"

const memberSchema = new mongoose.Schema({
    id: String,
    level: Number,
    xp: Number,
    server: String
})

const Member = mongoose.model("member", memberSchema)

export default Member