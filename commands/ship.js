import Canvas from "canvas"
import { MessageAttachment } from "discord.js"

export default {
    name: "ship",
    description: "Do you love someone? check if your love IS REAL",
    category: "fun",
    cooldown: 1,
    async execute(message, _, args) {
        const user = message.mentions.users.first() ||
            message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(" ").toLowerCase())?.user
        if (!user) return message.reply("Hmmmm you'll always be alone");
        if (user.bot) return message.reply("Hmmmm you seem pretty lonely shipping bots, can i help you?")
        const users = [strToInt(user.username + user.id + message.author.tag), strToInt(message.author.username + message.author.id + user.tag)]
        const ratio = Math.min(...users) * 100 / Math.max(...users)

        const image1 = await Canvas.loadImage(user.displayAvatarURL({ format: "png", size: 256 }));
        const image2 = await Canvas.loadImage(message.author.displayAvatarURL({ format: "png", size: 256 }));

        const canvas = Canvas.createCanvas(700, 350);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#000000";
        roundCorners(ctx, 0, 0, canvas.height, canvas.width, 6);
        ctx.clip();

        ctx.drawImage(image1, 0, 0, 350, 350);
        ctx.drawImage(image2, 350, 0, 350, 350);

        ctx.globalAlpha = "0.5";
        ctx.fill();

        ctx.globalAlpha = "1";
        ctx.strokeStyle = "#ff75cf";
        ctx.lineWidth = "4";
        roundCorners(ctx, 100, canvas.height/2 - 20, 40, 500, 6);
        ctx.stroke();

        ctx.fillStyle = "#b30041"
        roundCorners(ctx, 104, canvas.height/2 - 16, 32, ratio*4.92, 5)
        ctx.fill()

        ctx.font = "30px Arial unicode ms";
        ctx.textAlign = "center";
        ctx.fillStyle = "#f7c6f1";
        ctx.fillText(`${message.author.username} and ${user.username}`, canvas.width/2, canvas.height/2 - 57)
        ctx.fillText(`${ratio.toFixed()}% in love`, canvas.width/2, canvas.height/2 + 80);

        ctx.textBaseline = "middle";
        ctx.fillStyle = "#faf2f9";
        ctx.fillText("Are", canvas.width/2, canvas.height/2);

        ctx.lineWidth = "30";
        ctx.strokeStyle = "#ff75cf"
        roundCorners(ctx, 0, 0, canvas.height, canvas.width, 5);
        ctx.stroke();

        const att = new MessageAttachment(canvas.toBuffer(), "ship.png");
        message.channel.send({ files: [att] });
    }
}

function strToInt(string) {
    var result = "";
    for (var i = 0; i < string.length; i++) {
        var code = string.charCodeAt(i)
        result += code;
    }

    return parseInt(result.slice(0, result.length - 1));
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