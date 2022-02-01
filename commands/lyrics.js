import { MessageEmbed } from "discord.js"
import get from "node-fetch"

export default {
    name: "lyrics",
    category: "music",
    description: "find the lyrics for the current playing song",
    aliases: ["ly"],
    async execute(message, client, args) {
        const title = args.join(" ") || client.queue[message.guild.id]?.songs[0].title
        if (!title) return message.channel.send("please give a title for a song you want to search for")
        const toEdit = new MessageEmbed()
            .setTitle(title)
            .setImage("https://media.discordapp.net/attachments/747672872083914813/845186348734611486/g.gif")
            .setFooter("looking for lyrics...")
        const msg = await message.channel.send({ embeds: [toEdit] })
        const result = await get(`https://some-random-api.ml/lyrics?title=${title}`).then(res => res.json())
        if (!result.title) return message.reply("cannot find any lyrics for " + title)
        const embed = new MessageEmbed()
            .setTitle(result.title)
            .setDescription(result.lyrics.substring(0, 2048))
            .setAuthor(result.author, result.thumbnail.genius)
        msg.edit({ embeds: [embed] })
        if (result.lyrics.length > 2027) {
            const part2 = new MessageEmbed()
                .setDescription(result.lyrics.substring(2048, 4080))
            message.channel.send({ embeds: [part2] })
        }
    }
}