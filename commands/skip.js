import { getVoiceConnection } from "@discordjs/voice"

export default {
    name: "skip",
    category: "music",
    description: "skips the current playing song to next one",
    aliases: ["s"],
    execute(message, client) {

        const connection = getVoiceConnection(message.guild.id)
        const channel = message.member.voice.channel
        if (!channel) return message.reply("You should join a voice channel first.")

        if (!connection) return message.reply("there's nothing currently playing")

        const number = Math.ceil(message.member.voice.channel.members.size / 2)
        try {
            client.queue[message.guild.id].skip += 1
            if (client.queue[message.guild.id].skip >= number) {
                client.queue[message.guild.id].skip = 0
                client.queue[message.guild.id].player.stop()
                return message.channel.send("skipped.")
            }
            message.channel.send(`**${client.queue[message.guild.id].skip}/${number}** skipped.`)
        } catch {
            message.reply("There was an error skipping the song")
        }
    }
}