import { MessageEmbed } from "discord.js"

export default {
    name: 'userinfo',
    category: "utilities",
    description: "idk this one is pretty lame you can do it with other bots",
    execute(message, _, args) {
        const member = message.mentions.members.first() ||
            message.guild.members.cache.find(u => u.user.username.startsWith(args)) ||
            message.member
        const embed = new MessageEmbed()
            .setTitle(`${member.id} aka ${member.user.username}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Joined at**: ${member.joinedAt} \n**CreatedAt:** ${member.user.createdAt}`)
            .setFooter("these are pretty much the only informations worth giving.")
        message.channel.send({ embeds: [embed] })
    }
}