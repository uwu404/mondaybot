import { MessageEmbed } from "discord.js"
import fs from "fs"
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));

const commands = []
for (const file of commandFiles) {
    if (file !== "help.js") {
        const { default: command } = await import(`./${file}`)
        commands.push({ name: command.name, description: command.description, category: command.category })
    }
}


export default {
    name: "help",
    description: "sends this",
    execute(message, client, args) {
        const categories = Array.from(commands, c => c.category).filter((v, i, a) => a.indexOf(v) === i)
        const inviteURL = "https://discord.com/api/oauth2/authorize?client_id=746092663517872239&permissions=2217774912&scope=bot"
        const embed = new MessageEmbed()
            .setTitle(client.user.username + "'s commands")
            .setDescription(`**categories:**\n ${categories.map(c => `\`${c}\``).join(', ')}\n **use &help <category> | [invite the bot here](${inviteURL})**`)
            .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
        if (!args[0]) return message.channel.send({ embeds: [embed] })
        if (!categories.includes(args[0])) return message.channel.send(`I can't find any command for ${args[0]}`)
        const help = commands.filter(c => c.category === args[0])
        const helpEmbed = new MessageEmbed()
            .setTitle(client.user.username + "'s commands")
            .setColor("RANDOM")
            .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        for (const command of help) {
            helpEmbed.addField(command.name, `${command.description}`, true)
        }
        message.channel.send({ embeds: [helpEmbed] })
    }
}