export default {
    name: "hack",
    description: "fortnite is good",
    category: "fun",
    async execute(message) {
        const user = message.mentions.users.first();
        if (!user) return message.channel.send('ping someone to hack')
        const msg = await message.channel.send(`hacking ${user.tag} [${"-".repeat(50)}]`)
        let i = 50
        while (i > 0) {
            i--
            await delay(1000)
            await msg.edit(`hacking ${user.tag} [${"=".repeat(50 - i) + "-".repeat(i)}]`)
        }
        msg.edit("bruh")
    }
}

function delay(timeout) {
    return new Promise((res) => setTimeout(() => res(null), timeout))
}