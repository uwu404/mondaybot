import { MessageEmbed } from "discord.js"

export default {
    name: "pfp",
    category: "utilities",
    description: "get a user's avatar",
    aliases: ["av", "avatar"],
    async execute(message, _client, args) {
        const user = message.mentions.users.first() ||
            message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(" ").toLowerCase())?.user ||
            message.author
        const embed = new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
            .setTitle("Avatar")
            .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
        message.channel.send({ embeds: [embed] })
    }
}