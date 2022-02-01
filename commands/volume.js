export default {
    name: "volume",
    description: "sets the volume of the playing stream.",
    category: "music",
    aliases: ["setvolume", "v"],
    execute(message, client, args) {
        const audio = client.queue[message.guild.id]?.audio
        if (!audio) return message.reply("I have nothing playing on this server");

        const channel = message.member.voice.channel
        if (!channel) message.reply("You need to join a voice channel first")

        const num = parseInt(args[0])
        if (!num) return message.reply(`The argument must be a number`)
        if (num > 500) return message.reply(`cannot set the volume over 500`)

        audio.volume.setVolume(num/100)
        message.channel.send(`volume was set to ${num}`)
    }
}