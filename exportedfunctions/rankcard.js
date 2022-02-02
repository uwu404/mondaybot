import Canvas from "canvas"

const calculateWidthAndHeight = (width, height) => {
    const h = height / width * 934
    return [0, (282 - h) / 2, 934, h]
}

async function createRankCard(member, data, options) {
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ size: 256, format: "png" }));

    const canvas = Canvas.createCanvas(934, 282);
    const ctx = canvas.getContext("2d");

    roundCorners(ctx, 0, 0, canvas.height, canvas.width, 6);
    ctx.clip()

    if (!options.bg.startsWith("#")) {
        const img = await Canvas.loadImage(options.bg);
        ctx.drawImage(img, ...calculateWidthAndHeight(img.width, img.height));
    } else {
        ctx.fillStyle = options.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.7;
    if (options.opacity) ctx.globalAlpha = options.opacity
    roundCorners(ctx, 22, 33, 216, 890, 6);
    ctx.fill()

    ctx.globalAlpha = 1;

    ctx.font = "43px Arial unicode";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "start";
    const name = member.user.username.substr(0, 16);
    const styles1 = {
        default: { font: "43px Arial unicode ms", fillStyle: "#ffffff", },
        b: { font: "26px Arial", fillStyle: "#949494", },
        w: { fillStyle: "white" },
    };
    canvasMarkupText(ctx, `${name} <b>#${member.user.discriminator} <w> <w> </w>`, 257 + 18.5, 164, styles1);

    ctx.font = "60px Arial unicode ms"
    const width = 725 - ctx.measureText(`${data.level}#${data.rank}`).width

    const styles = {
        default: { font: "23px Arial unicode ms", fillStyle: "#ffffff" },
        b: { font: "60px Arial unicode ms", fillStyle: "#ffffff" },
        s: { font: "23px Arial unicode ms", fillStyle: options.levelColor },
        c: { font: "60px Arial unicode ms", fillStyle: options.levelColor }
    };
    canvasMarkupText(ctx, `RANK <b>#${data.rank} <s>LEVEL${`${data.level}`.startsWith("1") ? "" : " "}<c>${data.level}`, width, 98, styles);

    const xp2next = `/ ${abbrevNumber(data.requiredXP)} XP`
    ctx.font = `26px Arial unicode ms`;
    ctx.fillStyle = "#949494";
    ctx.fillText(xp2next, canvas.width - ctx.measureText(xp2next).width - 60, 164);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(abbrevNumber(data.XP), canvas.width - ctx.measureText(xp2next + abbrevNumber(data.XP)).width - 66, 164);

    ctx.beginPath();

    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3
    ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 17.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.strokeRect(257 + 18.5, 148 + 36.25, 615 - 18.5, 36);
    ctx.arc(257 + 615, 147.5 + 18.5 + 36.25, 17.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();

    const adjustedColor = options.bg.startsWith("#") ? adjust(options.bg, 20) : "#565863"
    ctx.fillStyle = adjustedColor;
    ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 17.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5, 148 + 36.25, 615 - 18.5, 36);
    ctx.arc(257 + 615, 147.5 + 18.5 + 36.25, 17.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();

    ctx.beginPath();

    if (Array.isArray(options.bColor)) {
        const pBarG = ctx.createRadialGradient(getWidth(data), 0, 650, 0);
        options.bColor.forEach((color, i) => {
            pBarG.addColorStop(i, color);
        });
        ctx.fillStyle = pBarG;
    } else {
        ctx.fillStyle = options.bColor;
    }


    ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 17.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5, 148 + 36.25, getWidth(data), 36);
    ctx.arc(257 + 18.5 + getWidth(data), 147.5 + 18.5 + 36.25, 17.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 8
    ctx.arc(132, 141, 84, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, 47, 56, 175, 175);
    ctx.restore();

    ctx.beginPath();
    ctx.fillStyle = getStatusColor(member.presence?.status);
    ctx.arc(193, 200, 23, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    if (member.presence?.status === "dnd") {
        ctx.fillStyle = "#000000"
        ctx.globalAlpha = 1
        roundCorners(ctx, 176.3, 196, 8.7, 33, 15)
        ctx.fill()
    }
    if (!member.presence || member.presence?.status === "offline") {
        ctx.beginPath();
        ctx.fillStyle = '#1c1c1c'
        ctx.arc(193, 200, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    if (member.presence?.status === "idle") {
        ctx.beginPath()
        ctx.fillStyle = "#e39919"
        ctx.arc(193, 200, 16.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath()
        ctx.fillStyle = "#303030"
        ctx.arc(185.2, 192.8, 11.5, 0, 2 * Math.PI)
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(193, 200, 23, 0, Math.PI * 2, true);
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 4
    ctx.stroke();

    return canvas.toBuffer();
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

function getWidth(data) {
    const cx = data.XP;
    const rx = data.requiredXP;

    if (rx <= 0) return 1;
    if (cx > rx) return 596.5;

    let width = (cx * 615) / rx;
    if (width > 596.5) width = 596.5;
    return width;
}

function getStatusColor(status) {
    switch (status) {
        case "dnd":
            return "#d62b2b"
        case "idle":
            return "#303030"
        case "online":
            return "#1bb322"
        case "streaming":
            return "#8a00c9"
        default: return "#424242"
    }
}

function canvasMarkupText(ctx, str, x, y, styles) {
    const content = (start, end, rule) => ({ start, end, rule });
    const render = content => {
        Object.assign(ctx, styles[content.rule] ? styles[content.rule] : {});
        const s = str.slice(content.start, content.end)
        ctx.fillText(s, x, y);
        x += ctx.measureText(s).width;
    };
    const stack = [], xx = x;
    var pos = 0, current = content(pos, pos, "default");
    stack.push(current);
    while (pos < str.length) {
        const c = str[pos++];
        if (c === "<") {
            if (str[pos] === "/") {
                render(stack.pop());
                current = stack[stack.length - 1];
                current.start = current.end = (pos += 3);
            } else {
                render(current);
                pos += 2;
                stack.push(current = content(pos, pos, str[pos - 2]));
            }
        } else { current.end = pos }
    }
    stack.length && render(current);
    return x - xx;
}

function abbrevNumber(value) {
    if (`${value}`.length < 4) return value
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 != 0) {
        shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
}

function adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default createRankCard