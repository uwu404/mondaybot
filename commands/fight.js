import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js"

export default {
    name: "fight",
    category: "games",
    description: "fights the pinged user...",
    async execute(message) {
        const user = message.mentions.users.first()
        if (!user) return message.channel.send("ping a user or i'll have to fight you")
        if (user.bot) return message.channel.send("you can't fight bots.")
        if (user.id === message.author.id) return message.channel.send("you can't fight yourself.")
        const selectedUser = Math.random() > 0.5
        const fighters = {
            [user.id]: { health: 100, defence: 1, now: selectedUser, actions: [] },
            [message.author.id]: { health: 100, defence: 1, now: !selectedUser, actions: [] }
        }
        const random = (min, max) => Math.floor(Math.random() * (max - min)) + min
        const options = [
            { name: "kick", value: [25, 35], type: "-", fail: 0.7 },
            { name: "punch", value: [10, 20], type: "-", fail: 0.95 },
            { name: "defend", value: "", type: "=", maxuses: 3 },
            { name: "heal", value: [1, 40], type: "+", maxuses: 5 },
            { name: "magic", value: [-50, 99], type: "%", maxuses: 1, fail: 0.4 }
        ]
        const validOps = Array.from(options, o => o.name).map(o => `\`${o}\``).join()

        message.channel.send(`<@${!selectedUser ? message.author.id : user.id}>, what you gon do. ${validOps}`)


        const filter = m => m.author.id === message.author.id || m.author.id === user.id
        const collector = message.channel.createMessageCollector(filter, { time: 600000 });

        collector.on("collect", m => {
            const fighter = m.author.id === message.author.id ? message.author : user
            const otherParty = m.author.id === message.author.id ? user : message.author
            if (!fighters[fighter.id].now) return m.channel.send("wait for your role lmao")
            const action = options.find(o => o.name === m.content.toLowerCase());
            if (!action) return message.channel.send(`that is not a valid option, please select one of the following options ${validOps}`)
            const uses = fighters[fighter.id].actions.filter(a => a === action.name)
            if (action.maxuses && uses.length >= action.maxuses) return m.channel.send(`the ${action.name} option can only be used ${action.maxuses} times in a fight`)
            fighters[fighter.id].actions.push(action.name)
            if (action.fail && Math.random() > action.fail) {
                m.channel.send(`you have tried the ${action.name} option but failed`)
                skip()
                return
            }
            const number = random(action.value[0], action.value[1])

            if (action.type === "-") {
                const damage = Math.floor(number * fighters[otherParty.id].defence)
                fighters[otherParty.id].health -= damage
                m.channel.send(
                    `${fighter.username} ${action.name}ed ${otherParty.username} dealing \`${damage}\` damage! \n${otherParty.username} is left with ${fighters[otherParty.id].health < 0 ? 0 : fighters[otherParty.id].health}`
                )
            }

            if (action.type === "+") {
                fighters[fighter.id].health += number
                m.channel.send(
                    `${fighter.username} did some ${action.name}ing and added ${number} to their total health, they have ${fighters[fighter.id].health} health points now.`
                )
            }

            if (action.type === "=") {
                const points = Math.random() * 0.3
                fighters[fighter.id].defence -= points
                m.channel.send(
                    `**${fighter.username} increased their defence points!!!** they will only recieve ${Math.floor(fighters[fighter.id].defence * 100)}% damage now`
                )
            }

            if (action.type === "%") {
                fighters[otherParty.id].health -= number
                const str = number > 0 ?
                `${fighter.username} did some ${action.name} dealing \`${number}\` damage! \n${otherParty.username} is left with ${fighters[otherParty.id].health < 0 ? 0 : fighters[otherParty.id].health}`:
                `${fighter.username} did some ${action.name} but failed. ${otherParty.username} has ${fighters[otherParty.id].health} now!`
                m.channel.send(str)
            }

            if (fighters[otherParty.id].health <= 0) {
                collector.stop();
                message.channel.send(`<@${otherParty.id}> loses the fight. congrats <@${fighter.id}>, you win 200 dank points!`)
                return
            }

            function skip() {
                fighters[otherParty.id].now = true
                fighters[fighter.id].now = false
                message.channel.send(`<@${otherParty.id}>, what you gon do. ${validOps}`)
            }
            skip()
        })

        collector.on("end", () => {
            message.channel.send("and the fight ends")
        })
    }
}