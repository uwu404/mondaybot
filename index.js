import Discord from "discord.js"
import fs from "fs"
import mongoose from "mongoose"
import Member from "./models/member.js"
import Server from "./models/server.js"

const { FLAGS } = Discord.Intents
const client = new Discord.Client({
    disableMentions: "everyone",
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: [FLAGS.GUILD_MESSAGES, FLAGS.GUILD_MEMBERS, FLAGS.GUILD_PRESENCES, FLAGS.GUILD_MESSAGE_REACTIONS, FLAGS.GUILDS, FLAGS.GUILD_VOICE_STATES]
});
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"))

client.commands = new Discord.Collection()
const coolDowns = new Discord.Collection()
client.queue = {}
const listOfUsers = []

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("connected to the database"))

const prefix = "&"

client.on("ready", () => {
    const activites = [
        { name: "Dawn FM", type: "LISTENING" },
        { name: `${client.commands.size} commands | &help`, type: "PLAYING" },
        { name: "the h.", type: "WATCHING" },
        { name: "pain olympics", type: "COMPETING" }
    ]
    client.user.setActivity(activites[Math.floor(Math.random() * activites.length)])
    setInterval(() => {
        client.user.setActivity(activites[Math.floor(Math.random() * activites.length)])
    }, 600000)
    console.log(`logged as ${client.user.tag}`)
    console.log(client.guilds.cache.size)
})

client.on("messageCreate", async message => {
    if (message.author.bot) return
    if (!message.channel.type === "dm") return
    if (!message.guild.me.permissions.has(["SEND_MESSAGES"])) return
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const cmd = args.shift().toLowerCase()
    const command = client.commands.get(cmd) || client.commands.find(c => c.aliases?.includes(cmd))

    if (message.content.startsWith("&")) {
        if (!command) return

        if (!coolDowns.has(command.name)) coolDowns.set(command.name, new Discord.Collection());

        const time = Date.now();
        const timestamps = coolDowns.get(command.name);
        const coolDown = (command.cooldown || 0.1) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + coolDown;

            if (time < expirationTime) {
                const timeLeft = (expirationTime - time) / 1000;
                return message.reply(`Hold up you need to wait ${timeLeft.toFixed()} seconds to use that command again`);
            }
        }

        timestamps.set(message.author.id, time);
        setTimeout(() => {
            timestamps.delete(message.author.id)
        }, coolDown);

        try {
            command.execute(message, client, args)
        } catch (err) {
            console.log(err)
            message.channel.send(`There was an error executing the ${cmd} command.`)
        }
    }

    if (listOfUsers.includes(message.author.id)) return
    listOfUsers.push(message.author.id)
    setTimeout(() => {
        listOfUsers.splice(listOfUsers.indexOf(message.author.id), 1)
    }, 3000)

    const number = Math.floor(Math.random() * 7) + 1
    const member = await Member.findOne({ id: message.author.id, server: message.guild.id }) ||
        new Member({ id: message.author.id, level: 0, xp: 0, server: message.guild.id })
    const server = await Server.findOne({ id: message.guild.id })
    member.xp += number
    if (member.xp > Math.trunc((member.level * 12) ** 1.25) + 17) {
        member.xp = 0
        member.level++
    }
    member.save()

    if (!server) return
    const rewards = server.rewards.filter(r => r.level <= member.level)
    const reward = rewards.sort((a, b) => b.level - a.level)
    if (!reward[0] || message.member.roles.cache.has(reward[0].role)) return
    await message.member.roles.add(reward[0].role)
        .catch(err => console.log(err))
    message.reply(`congrats you're level **${member.level}** now!`)
})

for (const file of events) {
    const { default: event } = await import(`./events/${file}`)
    event(client)
}

for (const file of commandFiles) {
    const { default: command } = await import(`./commands/${file}`)
    client.commands.set(command.name, command)
}

client.login(process.env.TOKEN)