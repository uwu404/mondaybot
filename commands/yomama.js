import fetch from "node-fetch"

export default {
    name: "yomama",
    description: "jokes about your mom",
    category: "memes",
    aliases: ["ym", "yomomma"],
    async execute(message) {
        const { joke } = await fetch("https://api.yomomma.info/").then(res => res.json())
        message.channel.send(joke)
    }
}