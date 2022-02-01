import { MessageEmbed } from "discord.js"
import Member from "../models/member.js"

export default {
    name: "levels",
    category: "levels",
    description: "Get current server leaderboard",
    aliases: ["leaderboard"],
    async execute(message, client) {
        const members = await Member.find({ server: message.guild.id });
        const sortedMembers = members.sort((a, b) => {
            return (b.level * 1e+100 + b.xp) - (a.level * 1e+100 + a.xp)
        })
        const array = []
        for (let i = 0; i < 10 && i < sortedMembers.length; i++) {
            const member = await client.users.fetch(sortedMembers[i].id)
            array.push(`${i + 1}- ${member.tag} \n`)
        }
        const embed = new MessageEmbed()
            .setDescription(array.join(""))
            .setTitle(`${message.guild.name}'s leaderboard`)
            .setColor("RANDOM")
            .setThumbnail(message.guild.iconURL())
        message.channel.send({ embeds: [embed] })
    }
}