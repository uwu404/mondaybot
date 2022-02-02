import Server from "../models/server.js"

export default {
    name: "set",
    category: "levels",
    description: "sets a background or accent color for the server's rank card",
    cooldown: 1,
    async execute(message, _, args) {
        if (!message.member.permissions.has(["ADMINISTRATOR"])) return message.reply("Admin permissions are required to use this command")
        const attachment = message.attachments.first() && (message.attachments.first().proxyURL + "?width=934&height=282")
        const accent = /^#([0-9A-F]{3}){1,2}$/i.test(args[0]) && args[0]
        if (!accent && !attachment) return message.reply("You need to provide a valid color as an argument")
        await Server.findOneAndUpdate({ id: message.guild.id }, { ...(accent && { accent }), ...(attachment && { backGround: attachment }) })
        if (attachment && !accent) return message.reply("Done! the rank card background has changed")
        message.reply("Done! the rank card color will now be " + accent)
    }
}