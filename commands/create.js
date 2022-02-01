import Canvas from "canvas"
import { MessageAttachment } from "discord.js"

export default {
    name: "create",
    description: "creates a meme.\nusage: &create <caption> (require attached image)",
    category: "memes",
    async execute(message, _, args) {
        const imgsrc = message.attachments.array()[0]?.proxyURL
        if (!imgsrc) return message.channel.send("an image needs to attached")
        const image = new Canvas.Image()
        image.onload = () => {
            const canvas = Canvas.createCanvas(image.width, image.height * 1.2);
            const ctx = canvas.getContext("2d");
        
            ctx.drawImage(image, 0, image.height*0.2, image.width, image.height)
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, image.width, image.height*0.2)

            ctx.font = `${canvas.width/2*0.4}px Arial`;
            for (let i = canvas.width/2*0.4; ctx.measureText(args.join(" ")).width - canvas.width > 0; i--) {
                ctx.font = `${i}px Arial`
            }

            ctx.fillStyle = "#000000"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(args.join(" "), canvas.width/2, image.height*0.2*0.5);

            const att = new MessageAttachment(canvas.toBuffer(), "meme.png");
            message.channel.send({ files: [att] })
        }
        image.src = imgsrc
    }
}