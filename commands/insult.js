import get from "node-fetch"

export default {
    name: "insult",
    category: "fun",
    description: "insult the pinged user",
    aliases: ["roast"],
    async execute(message) {
        const user = message.mentions.users.first() 
        const insult = await get("https://evilinsult.com/generate_insult.php?lang=en&type=json").then(res => res.json())
        message.channel.send(`<@${user.id}>, ${insult.insult}`)
    }
}