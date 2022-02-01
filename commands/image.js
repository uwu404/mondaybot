import { MessageAttachment, MessageEmbed } from "discord.js"
import get from "node-fetch"

export default {
    name: "image",
    category: "web",
    description: "sends a random image",
    aliases: ["img"],
    async execute(message) {
        const buffer = await get("https://picsum.photos/200/300").then(res => res.buffer())
        const att = new MessageAttachment(buffer, "image.jpg")
        const embed = new MessageEmbed()
            .setTitle("RANDOM IMAGE")
            .setURL("https://picsum.photos/200/300")
            .setImage("attachment://image.jpg")
        message.channel.send({ embeds: [embed], files: [att] })
    }
}