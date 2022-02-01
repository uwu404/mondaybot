import { MessageEmbed } from "discord.js"

export default {
    name: "embed",
    category: "utilities",
    description: "sends an embed made from arguments",
    async execute(message, _, args) {
        const a = args.join(" ")
        const footer = a.match(/(?<=&footer).[^&]+/gi) ?.join("")
        const description = a.match(/(?<=&description).[^&]+/gi) ?.join("")
        const image = a.match(/(?<=&image).[^&]+/gi) ?.join("")
        const title = a.match(/(?<=&title).[^&]+/gi) ?.join("")
        const url = a.match(/(?<=&url).[^&]+/gi) ?.join("")
        const author = a.match(/(?<=&author).[^&]+/gi) ?.join("")
        const color = a.match(/(?<=&color).[^&]+/gi) ?.join("")
        const embed = new MessageEmbed()
        if (footer) embed.setFooter(footer)
        if (color) embed.setColor(color)
        if (description) embed.setDescription(description)
        if (image) embed.setImage(image)
        if (author) embed.setAuthor(author)
        if (url) embed.setURL(url)
        if (title) embed.setTitle(title)
        message.channel.send({ embeds: [embed] })
    }
}