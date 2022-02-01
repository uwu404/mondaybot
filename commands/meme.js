import get from "node-fetch"
import { MessageEmbed } from "discord.js"
import { decode } from "html-entities"

export default {
    name: "meme",
    category: "memes",
    description: "gets a random meme from reddit",
    async execute(message) {
        const num = Math.floor(Math.random() * 49) + 1
        const result = await get("https://www.reddit.com/r/memes/hot/.json?limit=50").then(res => res.json())
        const meme = result.data.children[num].data
        const embed = new MessageEmbed()
            .setTitle(decode(meme.title))
            .setImage(decode(meme.preview.images?.[0].source.url))
            .setColor("ORANGE")
            .setURL(`https://reddit.com/meme`)
            .setFooter(`👍 ${meme.ups} | 💬 ${meme.num_comments}`)
        message.channel.send({ embeds: [embed] })
    }
}