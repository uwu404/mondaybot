import tf from "@tensorflow/tfjs-node"
import fetch from "node-fetch"
import cocoSsd from "@tensorflow-models/coco-ssd"

export default {
    name: "whatisthis",
    category: "fun",
    description: "Tries to guess what an image is about",
    cooldown: 10,
    async execute(message) {
        const attachment = message.attachments.first()?.url
        if (!attachment) return message.reply("You need to attach a PNG or JPG image")
        if ((!attachment.includes(".png") && !attachment.includes(".jpg")) || attachment.includes(".webp")) return message.channel.send("Error: unsupported image type")
        const data = await fetch(attachment).then(res => res.buffer())
        const model = await cocoSsd.load()
        const imgTensor = tf.node.decodeImage(new Uint8Array(data), 3)
        const predictions = await model.detect(imgTensor)
        const prediction = predictions.sort((a, b) => b.score - a.score)[0]
        if (!prediction) return message.channel.send("I don't know what that is")
        message.channel.send(`Prediction: ${prediction.class}\nConfidence: ${Math.round(prediction.score * 100)}%`)
    }
}