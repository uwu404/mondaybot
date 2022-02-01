import { MessageEmbed } from "discord.js"

export default {
    name: "queue",
    category: "music",
    description: "gets the server's queue",
    aliases: ["q"],
    execute(message, client) {
        const queue = client.queue[message.guild.id]?.songs
        if (!queue) return message.reply("I have no queue for this server. maybe there's nothing playing")
        const embed = new MessageEmbed()
            .setTitle(`${message.guild.name}'s Queue`)
            .setColor("PURPLE")
            .setTimestamp()
            .setThumbnail(client.queue[message.guild.id].songs[0].thumbnail[0].url)
        for (const q of queue) {
            embed.addField(`${queue.indexOf(q)+1}- ${q.author.name}`, `${q.title}`)
        }
        message.channel.send({ embeds: [embed] })
    }
}