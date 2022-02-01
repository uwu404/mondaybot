import { getVoiceConnection } from "@discordjs/voice"

export default {
    name: "pause",
    category: "music",
    description: "pauses the song",
    execute(message, client) {
        const connection = getVoiceConnection(message.guild.id)
        const channel = message.member.voice.channel
        if (!channel) return message.reply("You should join a voice channel first.")

        if (!connection) return message.reply("We are not in the same voice channel.")

        try {
            client.queue[message.guild.id].player.pause()
            message.channel.send(`<@${message.author.id}> paused the song`)
        } catch (err) {
            console.log(err)
            message.reply("there was an error pausing the song")
        }

    }
}