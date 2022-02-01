import Message from "../models/message.js"

export default (client) => {
    client.on("messageDelete", async (message) => {
        await Message.findOneAndDelete({ message: message.id })
            .catch(console.log)
    })
}
