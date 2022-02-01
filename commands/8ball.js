import replies from "../assets/8ball.js"

export default {
    name: "8ball",
    description: "8ball.",
    category: "games",
    execute(message) {
        message.channel.send(replies["yes-or-no"][Math.floor(Math.random() * replies["yes-or-no"].length)])
    }
}