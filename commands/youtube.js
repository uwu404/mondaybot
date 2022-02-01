import Youtube from "../exportedfunctions/youtube.js"

export default {
    name: "youtube",
    description: "searches something on youtube",
    category: "web",
    aliases: ["yt"],
    cooldown: 2,
    async execute(message, _, args) {
        const video = await Youtube(args.join("+"), 1)
            .catch(() => message.reply("oops seems like i can't find anything for that"))
        message.channel.send(video)
    }
}