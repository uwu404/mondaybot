import { MessageEmbed } from "discord.js"
import fetch from "node-fetch"

export default {
    name: "cat",
    category: "web",
    aliases: ["randomcat"],
    description: "sends a random for a cat. only cats cuz they're cute",
    async execute(message) {
        const { file } = await fetch('https://aws.random.cat/meow').then(res => res.json())
        const embed = new MessageEmbed()
            .setImage(file)
            .setTitle("random cat images")
            .setColor("#ff00d4")
            .setURL("https://aws.random.cat/meow")
        message.channel.send({ embeds: [embed] })
    }
}