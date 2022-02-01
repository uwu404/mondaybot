export default {
    name : "loop",
    aliases: ["l"],
    description: "loops the current song",
    category: "music",
    execute(message, client) {
        const connectionID = message.member.voice.channelID
        if (!connectionID) return message.reply("You should join a voice channel first.")

        if (!client.voice.connections.some(v => v.channel.id === connectionID)) return message.reply("We are not in the same voice channel.")

        const queue = client.queue[message.guild.id]?.songs[0]
        if (!queue) return message.reply("There is nothing playing.")

        if (queue.loop) {
            queue.loop = false
            return message.channel.send('loop was set to false')
        }
        queue.loop = true
        message.channel.send("loop was set to true")
    }
}
