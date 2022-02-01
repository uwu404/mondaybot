export default {
    name: "calculate",
    category: "utilities",
    description: "calculates the arguments...",
    execute(message, _client, args) {
        const array1 = args.join(" ").split("")
        const validMethods = ["/", "%", "*", " ", "=", "+", "(", ")", "<", ">", ".", "-", "**", "e"]
        if (args.join(" ") ===  "9 + 10") return message.reply("21?")
        if (array1.some(s => isNaN(s) && !validMethods.includes(s))) return message.channel.send("the arguments may include invalid types of characters")
        message.channel.send(eval(args.join(" ")).toString())
    }
}