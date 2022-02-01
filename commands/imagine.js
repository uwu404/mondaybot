export default {
    name: "imagine",
    description: "imagine a command that has no usage",
    category: "memes",
    execute(message) {
        message.channel.send(message.content)
    }
}