import { MessageEmbed } from "discord.js"
import fetch from "node-fetch"

export default {
    name: "anime",
    description: "searches for an anime",
    category: "web",
    cooldown: 1,
    async execute(message, _, args) {
        const { data } = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(args.join(" "))}`)
            .then(res => res.json())
        const embed = new MessageEmbed()
            .setURL(data[0].links.self)
            .setDescription(data[0].attributes.synopsis)
            .setTitle(data[0].attributes.titles.en)
            .setThumbnail(data[0].attributes.coverImage.large)
            .setColor("RANDOM")
            .setFooter(`average rating: ${data[0].attributes.averageRating}`)
        message.channel.send({ embeds: [embed] })
    }
}