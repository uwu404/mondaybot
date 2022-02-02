import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js"

const createEmbed = (health, defence, users, comment) => {
    const embed = new MessageEmbed()
        .setTitle(`${users[0]} VS. ${users[1]}`)
        .addField(users[0], `Health: ${health[0]}, Defense: ${defence[0]}`)
        .addField(users[1], `Health: ${health[1]}, Defense: ${defence[1]}`)
        .setDescription(comment)
    return embed
}

const createButton = (label, type) => {
    const styles = ["DANGER", "SECONDARY", "SUCCESS", "PRIMARY"]
    const button = new MessageButton()
            .setCustomId(label)
            .setLabel(label[0].toUpperCase() + label.slice(1))
            .setStyle(styles[type])
    return button
}

export default {
    name: "fight",
    category: "games",
    description: "fights the pinged user...",
    async execute(message) {
        const user = message.mentions.users.first()
        if (!user) return message.channel.send("ping a user or i'll have to fight you")
        if (user.id === message.author.id) return message.channel.send("you can't fight yourself.")
        const selectedUser = Math.random() > 0.5
        const fighters = {
            [user.id]: { health: 100, defence: 1, now: selectedUser, actions: [] },
            [message.author.id]: { health: 100, defence: 1, now: !selectedUser, actions: [] }
        }
        const random = (min, max) => Math.floor(Math.random() * (max - min)) + min
        const options = [
            { name: "attack", value: [20, 25], type: "-", fail: 0.95 },
            { name: "defend", value: "", type: "=", maxuses: 3 },
            { name: "heal", value: [1, 30], type: "+", maxuses: 5 },
            { name: "magic", value: [-50, 99], type: "%", maxuses: 1, fail: 0.4 }
        ]
        const validOps = Array.from(options, o => o.name).map(o => `\`${o}\``).join()

        const row = new MessageActionRow().setComponents(Object.values(options).map((option, i) => createButton(option.name, i)))

        const embed = comment => {
            const state = {
                users: [message.author.username, user.username],
                health: [fighters[message.author.id].health, fighters[user.id].health],
                defence: [fighters[message.author.id].defence, fighters[user.id].defence].map(d => ((1 - d) * 100) + "%")
            }
            return createEmbed([state.health[0], state.health[1]], [state.defence[0], state.defence[1]], [state.users[0], state.users[1]], comment)
        }

        const msg = await message.channel.send({ embeds: [embed("Just started fighting")], components: [row] })


        const filter = i => i.user.id === message.author.id || i.user.id === user.id
        const collector = message.channel.createMessageComponentCollector(filter, { time: 600000 });

        collector.on("collect", async i => {
            await i.deferUpdate()
            const fighter = i.user.id === message.author.id ? message.author : user
            const otherParty = i.user.id === message.author.id ? user : message.author
            if (!fighters[fighter.id].now) return
            const action = options.find(o => o.name === i.customId);
            const uses = fighters[fighter.id].actions.filter(a => a === action.name)
            if (action.maxuses && uses.length >= action.maxuses) return msg.edit({ embeds: [embed(`the ${action.name} option can only be used ${action.maxuses} times in a fight`)] })
            fighters[fighter.id].actions.push(action.name)
            if (action.fail && Math.random() > action.fail) {
                msg.edit({ embeds: [embed(`you have tried the ${action.name} option but failed`)] })
                skip()
                return
            }
            const number = random(action.value[0], action.value[1])

            if (action.type === "-") {
                const damage = Math.floor(number * fighters[otherParty.id].defence)
                fighters[otherParty.id].health -= damage
                msg.edit({
                    embeds: [embed(`${fighter.username} ${action.name}ed ${otherParty.username} dealing \`${damage}\` damage! \n${otherParty.username} is left with ${fighters[otherParty.id].health < 0 ? 0 : fighters[otherParty.id].health}`)]
                })
            }

            if (action.type === "+") {
                fighters[fighter.id].health += number
                msg.edit({
                    embeds: [embed(`${fighter.username} did some ${action.name}ing and added ${number} to their total health, they have ${fighters[fighter.id].health} health points now.`)]
                })
            }

            if (action.type === "=") {
                const points = Math.random() * 0.3
                fighters[fighter.id].defence -= points
                msg.edit({
                    embeds: [embed(`**${fighter.username} increased their defence points!!!** they will only recieve ${Math.floor(fighters[fighter.id].defence * 100)}% damage now`)]
                })
            }

            if (action.type === "%") {
                fighters[otherParty.id].health -= number
                const str = number > 0 ?
                    `${fighter.username} did some ${action.name} dealing \`${number}\` damage! \n${otherParty.username} is left with ${fighters[otherParty.id].health < 0 ? 0 : fighters[otherParty.id].health}` :
                    `${fighter.username} did some ${action.name} but failed. ${otherParty.username} has ${fighters[otherParty.id].health} now!`
                msg.edit({ embeds: [embed(str)] })
            }

            if (fighters[otherParty.id].health <= 0) {
                collector.stop();
                msg.edit({ embeds: [embed(`<@${otherParty.id}> loses the fight. congrats <@${fighter.id}>, you win 200 dank points!`)] })
                return
            }

            function skip() {
                fighters[otherParty.id].now = true
                fighters[fighter.id].now = false
                msg.edit({ embeds: [embed(`<@${otherParty.id}>, what you gon do. ${validOps}`)] })
            }
            skip()
        })

        collector.on("end", () => {
            message.channel.send("and the fight ends")
        })

    }
}