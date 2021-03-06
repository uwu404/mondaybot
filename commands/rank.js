import { MessageAttachment } from "discord.js"
import Member from "../models/member.js"
import createCard from "../exportedfunctions/rankcard.js"
import Server from "../models/server.js"

export default {
    name: "rank", 
    category: "levels",
    description: "gives a user current rank and level",
    aliases: ["level"],
    cooldown: 2,
    async execute(message) {
        const user = message.mentions.members.first() || message.member
        if (user.bot) return message.channel.send("you cannot rank bots")
        const members = await Member.find({ server: message.guild.id });
        const server = await Server.findOne({ id: message.guild.id })
        const member = members.find(m => m.id === user.id) || { level: 0, xp: 0, id: user.id };
        if (!members.some(m => m.id === user.id)) members.push(member)
        const sortedUsers = members.sort((a, b) => {
            return (b.level * Number.MAX_SAFE_INTEGER + b.xp) - (a.level * Number.MAX_SAFE_INTEGER + a.xp)
        })
        const rank = Array.from(sortedUsers, u => u.id).indexOf(member.id) + 1
        const requiredXP = Math.trunc((member.level * 12) ** 1.25) + 17
        const info = { rank, requiredXP, XP: member.xp, level: member.level }
        const Card = await createCard(user, info, { levelColor: server?.accent || "#ff0022", bg: server?.backGround || "#191a21", bColor: server?.accent || "#ff0022" })
        const att = new MessageAttachment(Card, "rank.png")
        message.channel.send({ files: [att] })
    }
}