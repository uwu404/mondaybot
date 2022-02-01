import { MessageEmbed } from "discord.js"
import os from 'os'

export default {
    name: "stats",
    description: "view general information about bot stats",
    category: "utilities",
    execute(message, client) {
        const embed = new MessageEmbed()
            .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Users", value: client.users.cache.size, inline: true },
                { name: "Servers", value: client.guilds.cache.size, inline: true },
                { name: "Uptime", value: new Date(os.uptime() * 1000).toISOString().substr(11, 8), inline: true }
            )
            .setColor("RANDOM")

        message.channel.send({ embeds: [embed] })
    }
}