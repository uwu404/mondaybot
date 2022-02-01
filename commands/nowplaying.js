import { MessageEmbed } from "discord.js"

export default {
    name: "nowplaying",
    category: "music",
    description: "sends the currently playing song in the voice channel",
    aliases: ["now playing", "np", "currently playing"],
    execute(message, client) {
        const song = client.queue[message.guild.id]?.songs[0]
        const embed = new MessageEmbed()
            .setTitle(song.title)
            .setThumbnail(song.thumbnail[0].url)
            .setAuthor(`Request by: ${song.by.tag}`, song.by.displayAvatarURL({ dynamic: true }))
            .setColor("RED")
            .setURL(song.link.link)
        message.channel.send({ embeds: [embed] })
    }
}