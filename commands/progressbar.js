import Canvas from "canvas"
import { MessageAttachment, MessageEmbed } from "discord.js"

export default {
    name: "progressbar",
    description: "gets the current playing video's progress bar",
    category: "music",
    aliases: ["pb"],
    async execute(message, client) {
        const queue = client.queue[message.guild.id]?.songs
        if (!queue) return message.reply("There is nothing playing on this server");

        const duration = queue[0]?.duration
        if (!duration) return message.reply("There is nothing playing on this server")
        const streamTime = client.queue[message.guild.id].audio.playbackDuration
        const on = streamTime / (duration * 1000)

        const canvas = Canvas.createCanvas(300, 15)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = "#000000"
        roundCorners(ctx, 0, 0, canvas.height, canvas.width, 20)
        ctx.fill()

        ctx.fillStyle = "#ed0000"
        roundCorners(ctx, 0, 0, canvas.height, on * 300, 20)
        ctx.fill();

        const translate = (ms) => {
            const minutes = Math.floor(ms / 60000);
            const seconds = ((ms % 60000) / 1000).toFixed(0);
            return `${minutes}:${seconds.padStart(2, "0")}`;
        }
        const att = new MessageAttachment(canvas.toBuffer(), "progress.png")
        const embed = new MessageEmbed()
            .setImage("attachment://progress.png")
            .setDescription(`streamed ${translate(streamTime)} minutes.\n${translate(duration * 1000 - streamTime)} minutes left`)
            .setColor("RANDOM")
        message.channel.send({ embeds: [embed], files: [att] })
    }
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