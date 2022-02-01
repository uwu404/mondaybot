const findX = (xs, value) => {
    const xString = xs.join("")
    const xss = xString.replace(/\-/g, "+-").split("+")
    if (xString.match(/x\s*\*\s*x/g)) {
        const a = xss.reduce((a, b) => a + (b.match(/x\s*\*\s*x/g) ? parseInt(b) || 1 : 0), 0)
        const b0 = xss.filter(x => !x.match(/x\s*\*\s*x/g)).join("+")
        const b = eval(b0.replace(/x/g, 1)) || 0
        const delta = (b ** 2) - 4 * a * (value)
        const math = `${a}x²+${b}x+${value} = 0\nΔ = ${b}²-4*${a}*${value}`
        if (delta === 0) {
            const x0 = b / (2 * a)
            const steps = `${math}\nΔ = ${delta} = 0\nx0 = ${b} / (2 * ${a})\nx0 = ${x0}`
            return steps
        }
        if (delta > 0) {
            const x1 = (b - Math.sqrt(delta)) / (2 * a)
            const x2 = (b + Math.sqrt(delta)) / (2 * a)
            const steps = `${math}\nΔ = ${delta} > 0\nx1 = (${b} - √Δ) / (2 * ${a}); x2 = (${b} + √Δ) / (2 * ${a})\nx1 = ${x1}; x2 = ${x2}`
            return steps
        }
        if (delta < 0) {
            const steps = `${math}\nΔ = ${delta} < 0\nx1 = (${b} - i√-Δ) / ${2 * a}; x2 = (${b} + i√-Δ) / ${2 * a}`
            return steps
        }
    }
    const xx = eval(xString.replace(/x/g, 1))
    return value / xx
}

export default {
    name: "solve",
    description: "solves simple equations.",
    aliases: ["findx"],
    category: "utilities",
    execute(message, _client, args) {

        const array1 = args.join(" ").split("")
        const validMethods = ["/", "*", " ", "+", "=", ".", "-", "**", "x", "(", ")"]

        if (array1.some(s => isNaN(s) && !validMethods.includes(s))) return message.channel.send("the arguments may include invalid types of characters")
        if (!array1.includes("=")) return message.reply("use '&calculate' instead")
        if (message.content.match("=").length > 1) return message.reply("i'm too stupid for that kinda equations")

        const switchSign = (x) => {
            if (x.match(/-/g)) return x.replace(/-/g, "+")
            if (x.match(/\+/g)) return x.replace(/\+/g, "-")
            else return "-" + x
        }
        const XPattern = /(([+-]?([0-9]*[.])?[0-9]+[*/])*([-+]*\s*x\s*)([*/][+-]?([0-9]*[.])?[0-9]+)*[*/]*)+/g
        const parts = args.join("").replace(/\dx/g, match => `${parseInt(match)}*x`).split("=")
        const reverse = (parts[0].match(XPattern) || []).map(c => switchSign(c))
        const unknown = parts[1].match(XPattern) || []
        const xs = unknown.concat(reverse)
        const value = parts[0].replace(XPattern, "") + `-${eval(parts[1].replace(XPattern, "")) || 0}`
        const number = eval(value)
        const x = findX(xs, number)

        message.channel.send(`\`\`\`${args.join("")}\n${x}\`\`\``)
    }
}