import get from "node-fetch"

export default {
    name: "joke",
    category: "memes",
    description: "sends a random joke",
    aliases: ["dadjoke"], 
    async execute(message) {
        const joke = await get("https://icanhazdadjoke.com/slack").then(res => res.json())
        message.channel.send(joke.attachments[0].text)
    }
}