import { getVoiceConnection } from "@discordjs/voice"

export default {
    name: "resume",
    category: "music",
    description: "resumes the song",
    aliases: ["unpause"],
    execute(message, client) {
        const channel = message.member.voice.channel
        const connection = getVoiceConnection(message.guild.id)
        if (!channel) return message.reply("You should join a voice channel first.")

        if (!connection) return message.reply("We are not in the same voice channel.")

        try {
            client.queue[message.guild.id].player.unpause()
            message.channel.send(`<@${message.author.id}> resumed the song`)
        } catch {
            message.reply("there was an error resuming the song")
        }

    }
}