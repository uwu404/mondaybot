import { getVoiceConnection } from "@discordjs/voice"

export default {
    name: "stop",
    category: "music",
    description: "stops the current playing song in the voice channel",
    execute(message, client) {

        const connection = getVoiceConnection(message.guild.id)
        if (!message.member.voice.channel) return message.reply("You should join a voice channel first.")

        if (!connection) return message.reply("I'm not currently in a voice channel in this server")

        try {
            delete client.queue[message.guild.id]
            connection.destroy()
            message.channel.send("stopped the queue")
        } catch {
            message.reply("there was an error stopping the queue")
        }

    }
}