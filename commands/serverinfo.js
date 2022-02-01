import { MessageEmbed } from "discord.js"

export default {
    name: "serverinfo",
    aliases: ["si", "sinfo"],
    category: "utilities",
    description: "sends info about the server you are in",
    async execute(message) {
        const owner = await message.guild.members.fetch(message.guild.ownerID)
        const embed = new MessageEmbed()
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.bannerURL())
            .setFooter(`${message.guild.id}`, message.guild.iconURL({ dynamic: true }))
            .setColor("RANDOM")
            .setTimestamp(message.guild.createdAt)
            .addFields(
                { name: "Member count", value: message.guild.memberCount, inline: true },
                { name: "Owner", value: owner.user.tag, inline: true },
                { name: "Total channels count", value: message.guild.channels.cache.size, inline: true },
                { name: "Categories", value: message.guild.channels.cache.filter(c => c.type === "category").size, inline: true },
                { name: "Voice channels", value: message.guild.channels.cache.filter(c => c.type === "voice").size, inline: true },
                { name: "Text channels", value: message.guild.channels.cache.filter(c => c.type === "text").size, inline: true },
                { name: "Roles", value: message.guild.roles.cache.size, inline: true },
                { name: "Highest role", value: message.guild.roles.highest, inline: true },
                { name: "Region", value: message.guild.region, inline: true }
            )
        message.channel.send({ embeds: [embed] })
    }
}