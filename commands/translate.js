import { MessageEmbed } from "discord.js"
import fetch from "node-fetch"

export default {
    name: "translate",
    description: "translates to the given language\nusage: &translate <text> to <language-code>",
    category: "utilities",
    cooldown: 2,
    async execute(message, _, args) {

        const text = args.join(" ").match(/.+(?=to)/g)?.[0]
        const to = args.join("").match(/(?<=to)[^to]*$/g).join("")

        const result = await fetch(`https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=${to}&textType=plain&profanityAction=NoAction`, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "x-rapidapi-key": process.env.RAPIDAPI,
                "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com"
            },
            "body": JSON.stringify([
                {
                    "Text": text
                }
            ])
        })
            .then(res => res.json())
            .catch(() => message.channel.send("an error occurred while translating."));
        if (!result[0].detectedLanguage) return message.reply("there was an error translating")


        const embed = new MessageEmbed()
            .setFooter(`translated from ${result[0].detectedLanguage.language} to ${result[0].translations[0].to}`)
            .setColor("RANDOM")
            .setDescription(result[0].translations[0].text)
        message.channel.send({ embeds: [embed] })
    }
}