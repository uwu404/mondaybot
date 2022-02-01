export default {
    name: "owofy",
    description: "UwU",
    category: "fun",
    execute(message, _, args) {
        const owos = [" OwO ", " UwU ", " <3 ", " </3 ", " >\\_< ", " Õ^Õ ", " x3 ", " :3 ", " (・\\`ω´・) ", " ;;w;; "]
        const msg = args.join(" ").replace(/l|r/gi, "w")
            .replace(/N([AEIOU])/g, "NY")
            .replace(/n([aeiou])/g, "ny")
            .replace(/ove/gi, "uv")
            .replace(/!/g, owos[Math.floor(Math.random() * owos.length)])
            .replace(/\?/g, " nya?")
        message.channel.send(msg)
    }
}