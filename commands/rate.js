import tf from "@tensorflow/tfjs-node"
import fetch from "node-fetch"
import cocoSsd from "@tensorflow-models/coco-ssd"

const comment = (rate) => {
    switch (true) {
        case rate < 1: return "Are you even human?"
        case rate < 2: return "Ewww bruh you're hella ugly"
        case rate < 3: return "You mad ugly"
        case rate < 4: return "You're so ugly"
        case rate < 5: return "You kinda ugly not gon lie"
        case rate < 6: return "you mid"
        case rate < 7: return "Not bad"
        case rate < 8: return "Looking good."
        case rate < 9: return "Are you a model? or maybe a singer?"
        case rate < 10: return "You're flawless... wanna date?"
        case rate === 10: return "PERFECT"
    }
}

export default {
    name: "rate",
    category: "fun",
    description: "rates your face",
    aliases: ["ratemyface", "rateme"],
    cooldown: 10,
    async execute(message) {
        const attachment = message.attachments.first()?.url || (message.mentions.users.first() || message.author).displayAvatarURL({ format: "png" })
        if (!attachment) return message.reply("You need to attach a PNG or JPG image")
        if ((!attachment.includes(".png") && !attachment.includes(".jpg")) || attachment.includes(".webp")) return message.channel.send("Error: unsupported image type")
        const data = await fetch(attachment).then(res => res.buffer())
        const model = await cocoSsd.load()
        const imgTensor = tf.node.decodeImage(new Uint8Array(data), 3)
        const predictions = await model.detect(imgTensor)
        const prediction = predictions.find(p => p.class === "person")
        const rate = Math.round((prediction?.score || 0) * 1000) / 100
        message.channel.send(`${rate}/10 ${comment(rate)}`)
    }
}