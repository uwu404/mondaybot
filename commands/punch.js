import { MessageEmbed } from "discord.js"
import Tenor from "../exportedfunctions/tenor.js"

export default {
    name: "punch",
    category: "fun",
    description: "sends a punch gif",
    async execute(message, client, args) {
        const user = message.mentions.users.first() ||
            message.guild.members.cache.find(u => u.user.username.startsWith(args.join(" ")))?.user
        if (!user) return message.reply("PING SOMEONE TO PUNCH!!!!!")
        if (user.id == message.author.id) return message.reply("bruh")
        if (user.id == client.user.id) return message.reply("dOn't pUncH mEh PlZ")
        const replies = [
            `Yooooo ${user.username} is getting puched bruv`,
            `${user.username} getting punched uwu </3`,
            `${message.author.username} punching ${user.username}`
        ]
        const gif = await Tenor("punch", 50).catch(console.log)
        const embed = new MessageEmbed()
            .setAuthor(replies[Math.floor(Math.random() * replies.length)], message.author.displayAvatarURL({ dynamic: true }))
            .setImage(gif)
            .setTimestamp()
        message.channel.send({ embeds: [embed] })
    }
}