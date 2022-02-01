import { MessageEmbed } from "discord.js"
import Gif from "../exportedfunctions/tenor.js"

export default {
    name: "gif",
    description: "sends a gif\nusage: &gif <search word>",
    category: "utilities",
    aliases: ["tenor"],
    async execute(message, _, args) {
        const gif = await Gif(args.join("+"), 10).catch(() => message.channel.send("oops seems like i can't find any gifs for that"))
        const embed = new MessageEmbed()
            .setImage(gif)
            .setTitle(`Gif search`)
            .setURL("https://tenor.com/")
            .setThumbnail("https://www.gstatic.com/tenor/web/attribution/PB_tenor_logo_blue_vertical.png")
        message.channel.send({ embeds: [embed] })
    }
}