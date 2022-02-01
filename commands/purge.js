export default {
    name: "purge",
    category: "mod",
    aliases: ["clean", "bulkdelete"],
    description: "deletes the given number of messages",
    async execute(message, _, args) {
        const messages = parseInt(args.join(""))
        if (!message.member.hasPermission(["MANAGE_CHANNELS"]) && !message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You don't have permissions to use this command")
        if (!message.guild.me.hasPermission(["MANAGE_CHANNELS"])) return message.channel.send("I don't have the permission to delete messages")
        if (!messages) return message.channel.send("the argument should be a number, `$purge <number>`")
        if (messages > 100) return message.channel.send("Cannot delete more than 100 messages at the same time for important reasons")
        message.channel.bulkDelete(messages)
    }
}