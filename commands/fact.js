import { MessageEmbed } from "discord.js"
import fetch from "node-fetch"

export default {
    name: "fact",
    category: "web",
    description: "sends a random fact",
    async execute(message) {
        const { text } = await fetch("https://uselessfacts.jsph.pl/random.json?language=en").then(res => res.json())
        const embed = new MessageEmbed()
            .setTitle("Random Useless Facts")
            .setURL("https://uselessfacts.jsph.pl/")
            .setColor("BLUE")
            .setDescription(text)
        message.channel.send({ embeds: [embed] });
    }
}