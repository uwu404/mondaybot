import Message from "../models/message.js"

export default {
    name: "reactionrole",
    category: "mod",
    cooldown: 10,
    description: "reaction roles\nusage: &reactionrole <message> <role> <channel>",
    aliases: ["rr"],
    async execute(message, _, args) {
        if (!message.member.permissions.has(["MANAGE_ROLES"])) return
        if (!message.guild.me.permissions.has(["MANAGE_ROLES"])) return message.channel.send(`i don't have the perms to manage roles`)
        const channel = message.mentions.channels.first() || message.channel
        const role = message.mentions.roles.first() ||
            message.guild.roles.cache.find(r => r.name === args[1]) ||
            await message.guild.roles.fetch(args[1])
        if (!role) return message.channel.send(`I can't find a role with the name ${args[1]}`)
        if (role.position > message.guild.me.roles.highest.position) return message.channel.send("I can't access that role, place me above other roles that you want me to manage.")
        const msg = await channel.messages.fetch(args[0])
        if (!msg) return message.channel.send(`I can't find a message with the id ${args[0]}`)
        const botMessage = await message.channel.send("you have 1 minute to react with any emoji you want")
        const filter = (_, u) => u.id === message.author.id
        const collected = await botMessage.awaitReactions({ max: 1, time: 60000, filter })
        if (!collected) return message.channel.send("1 minute has passed but no reaction was detected")
        const RMessage = await Message.findOne({ message: msg.id }) || new Message({ message: msg.id })
        if (!RMessage.emojis) RMessage.emojis = []
        RMessage.emojis.push({
            role: role.id,
            name: collected.first().emoji.identifier
        })
        await RMessage.save()
        message.channel.send(`Done! everyone that reacts to message ${msg.id} with ${collected.first().emoji.name} will be given the role ${role.name}`)
    }
}