import { MessageEmbed } from "discord.js"
import fetch from "node-fetch"

export default {
    name: "google",
    category: "web",
    cooldown: 2,
    description: "what if i tell you that it's bing actually",
    aliases: ["bing", "image-search", "search"],
    async execute(message, _, args) {
        if (!args[0]) return message.channel.send("Cannot search for nothing")
        const NSFWTerms = /shit|poop|sht/gi
        if (NSFWTerms.test(args.join("")) && !message.channel.nsfw) return message.reply("use an nsfw channel instead")
        const result = await fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=${args.join("+")}&count=10&safeSearch=Moderate`, {
            method: "GET",
            headers: {
                "x-rapidapi-key": process.env.RAPIDAPI,
                "x-rapidapi-host": "bing-image-search1.p.rapidapi.com"
            }
        }).then(res => res.json()).catch(() => message.channel.send("I can't find anything for that"))

        const element = result.value[Math.floor(Math.random() * result.value.length)]
        const embed = new MessageEmbed()
            .setImage(element.contentUrl)
            .setTitle(element.name)
            .setURL(element.webSearchUrl)
        message.channel.send({ embeds: [embed] })
    }
}