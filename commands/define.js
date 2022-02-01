import { MessageEmbed } from "discord.js"
import get from "node-fetch"

export default {
    name: "define",
    category: "web",
    description: "defines the arguments using urban dictionary.",
    aliases: ["ub"],
    async execute(message, _, args) {
        const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
        const { list } = await get(`https://api.urbandictionary.com/v0/define?term=${args.join("+")}`)
            .then(res => res.json())
            .catch(() => message.channel.send("oops seems like i can't find any definition."))
        if (!list.length) return message.channel.send("oops seems like i can't find any definitions.")
        const embed = new MessageEmbed()
            .setTitle(list[0].word)
            .addField("Definition:", trim(list[0].definition.replace(/[\[\]]/g, ""), 1024))
            .addField("Example:", trim(list[0].example.replace(/[\[\]]/g, ""), 1024))
            .setColor("RED")
        message.channel.send({ embeds: [embed] })
    }
}