import Canvas from "canvas"
Canvas.registerFont("assets/arial-unicode-ms.ttf", { family: "Arial unicode ms" })
import { MessageAttachment } from "discord.js"

export default {
  name: "screenshot",
  description: "creates a fake screenshot of someone saying something.",
  category: "fun",
  async execute(message, _, args) {

    const text = message.mentions.users.first() ? args.slice(1).join(" ") : args.join(" ")
    const user = message.mentions.members.first() || message.member
    const imagesrc = user.user.displayAvatarURL({ dynamic: true, format: "png" })

    if (!text) return message.channel.send("Discord api error: cannot send an empty message")

    const w = user.user.username.length > 13 ? 600 : 500
    const image = await Canvas.loadImage(imagesrc)
    const canvas = Canvas.createCanvas(w, 100)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = "#36393e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = user.roles.color?.color ? user.displayHexColor : "#ffffff"
    ctx.font = "27px Arial unicode ms"
    ctx.fillText(user.user.username, 118, 38)
    const width = ctx.measureText(user.user.username).width

    var x = width + 128
    if (user.user.bot) {
      ctx.fillStyle = "#7289da"
      roundCorners(ctx, width + 129, 13, 30, 55, 5)
      ctx.fill()
      ctx.font = "21px Arial unicode ms"
      ctx.fillStyle = "white"
      ctx.fillText("BOT", width + 135, 35)
      x += 65
    }

    ctx.fillStyle = "#757882"
    ctx.font = "20px Arial unicode ms"
    ctx.fillText(`${date()}`, x, 38)

    ctx.fillStyle = "#dcddde"
    ctx.font = "27px Arial unicode ms"
    ctx.fillText(text, 120, 77)

    ctx.arc(58, 50, 36, 0, Math.PI * 2, true)
    ctx.clip();

    ctx.drawImage(image, 20, 12.5, 73, 73);

    const att = new MessageAttachment(canvas.toBuffer(), "sreenshot.png")
    message.channel.send({ files: [att] })
  }
}

function date() {
  const d = new Date()
  const e = d.getHours() <= 13 ? "AM" : "PM"
  const i = d.getHours() <= 13 ? d.getHours() : d.getHours() - 12
  return `Today at ${i > 9 ? i : "0" + i}:${d.getMinutes()} ${e}`
}

function roundCorners(ctx, x, y, h, w, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}