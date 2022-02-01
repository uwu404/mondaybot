import Server from "../models/server.js"

export default {
    name: "reward",
    category: "levels",
    description: "sets a reward for every member that achieves a certain level",
    cooldown: 1,
    async execute(message, _, args) {
        if (!message.member.permissions.has(["ADMINISTRATOR"])) return
        const level = parseInt(args[0])
        if (!level) return message.reply("use reward: `&reward <level> <role-id or role-mention or role-name>`")
        const role = message.mentions.roles.first() ||
            message.guild.roles.cache.find(r => r.name === args.slice(1).join(" ")) ||
            await message.guild.roles.fetch(args[1])
        if (!role) return message.reply("use reward: `&reward <level> <role-id or role-mention or role-name>`")
        if (role.managed || role.position > message.guild.me.roles.highest.position) return message.reply(`i cannot manage that role.`)
        const reward = {
            level,
            role: role.id
        }
        const server = await Server.findOne({ id: message.guild.id }) || new Server({ id: message.guild.id })
        if (!server.rewards) server.rewards = []
        server.rewards.push(reward)
        await server.save()
        message.channel.send(`Done. every one that gets to level **${level}** will recieve the role **${role.name}**`)
    }
}