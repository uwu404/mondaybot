export default {
    name: "guess",
    description: "Guess a number/very original",
    category: "games",
    execute(message) {
        const rand = Math.floor(Math.random() * 20) + 1
        const now = Date.now() / 1000 + 10
        message.reply("Alright you have 10 seconds to guess a random number from `1` to `20`")

        const filter = m => m.author.id === message.author.id
        const collector = message.channel.createMessageCollector(filter, { time: 10000 });

        collector.on("collect", m => {
            if (parseInt(m) === rand) {
                message.channel.send("Ok you're right you win 200 dank points")
                collector.stop()
                return
            }
            message.channel.send(`oops wrong guess try again you have ${(now - Date.now() / 1000).toFixed()} seconds left`)
        })
        collector.on("end", () => {
            message.channel.send("***Game Set***")
        })
    }
}