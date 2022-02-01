import Canvas from "canvas"
import { MessageAttachment } from "discord.js"

export default {
    name: "trans",
    description: "you've seen this before but with a gay flag instead",
    category: "fun",
    cooldown: 2,
    execute(message) {
        const user = message.mentions.users.first() || message.author
        const imgsrc = user.displayAvatarURL({ format: "png", size: 512 })
        const image = new Canvas.Image()
        image.onload = async () => {
            const canvas = Canvas.createCanvas(image.width, image.height)
            const ctx = canvas.getContext("2d")

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            ctx.globalAlpha = "0.3"

            const filter = await Canvas.loadImage("./assets/trans.png")
            ctx.drawImage(filter, 0, 0, canvas.width, canvas.height)

            const att = new MessageAttachment(canvas.toBuffer(), "trans.png")
            message.channel.send({ files: [att] })
        }
        image.src = imgsrc
    }
}