import Message from "../models/message.js"

export default (client) => {
    client.on("messageReactionAdd", async (reaction, user) => {
        const message = await Message.findOne({ message: reaction.message.id })
        const emoji = message?.emojis.find(e => e.name === reaction.emoji.identifier)
        if (!emoji) return 
        const role = await reaction.message.guild.roles.fetch(emoji.role)
        const member = reaction.message.guild.members.cache.get(user.id)
        if (!reaction.message.guild.me.permissions.has(["MANAGE_ROLES"])) return
        member.roles.add(role).catch(console.log)
    })
} 