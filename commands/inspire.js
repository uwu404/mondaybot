import { MessageEmbed } from "discord.js"
import get from "node-fetch"
import { decode } from "html-entities"

export default {
    name: "inspire",
    category: "deep",
    description: "sends a ***VERY*** inspiring quote",
    async execute(message) {
        const quote = await get("https://zenquotes.io/?api=random").then(res => res.json())
        const embed = new MessageEmbed()
            .setColor("blue")
            .setAuthor(decode(quote[0].a))
            .setDescription(decode(quote[0].q))
        message.channel.send({ embeds: [embed] })
    }
}