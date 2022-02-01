export default {
    name: "ping", 
    category: "utilities",
    description: "Ping command/get bot latency",
    async execute(message) {
        const msg = await message.channel.send(`Pong`)
        msg.edit(`Pong \`${msg.createdTimestamp - message.createdTimestamp}ms\``)
    }
}