import Server from "../models/server.js"

export default {
    name: "clear",
    category: "levels",
    description: "clears a reward",
    aliases: ["clear"],
    cooldown: 2,
    async execute(message, _, args) {
        if (!args[0]) return message.reply("use clear: &clear <role id>")
        const role = message.mentions.roles.first() ||
            message.guild.roles.cache.find(r => r.name === args[0]) ||
            await message.guild.roles.fetch(args[0])
        const server = await Server.findOne({ id: message.guild.id })
        const index = server.rewards.findIndex(r => r.role === role.id)
        if (index === -1) return message.reply(`there is no role with id ${role.id} that can be cleared`)
        server.rewards.splice(index, 1)
        await server.save()
        message.channel.send("cleared reward with id " + role.id)
    }
}