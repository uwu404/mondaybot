import playdl from "play-dl"
import Youtube from "../exportedfunctions/youtube.js"
import { MessageEmbed } from "discord.js"
import { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice"

class Song {
    constructor(details, link, by) {
        this.by = by
        this.thumbnail = details.video_details.thumbnails
        this.link = link
        this.views = details.video_details.views
        this.author = {
            avatar: details.video_details.channel.iconURL,
            name: details.video_details.channel.name
        }
        this.title = details.video_details.title
        this.timestamp = details.video_details.uploadedAt
        this.duration = details.video_details.durationInSec
        this.loop = false
    }
}

const format = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19)

const play = async (link, player, connection, message, client) => {
    const song = await playdl.stream(link.link)

    const embed = new MessageEmbed()
        .setThumbnail(link.thumbnail[0].url)
        .setTitle(link.title)
        .addField("views", `${link.views}`, true)
        .addField("duration", format(link.duration), true)
        .setFooter(link.author.name, link.author.avatar)
        .setColor("RANDOM")
    message.channel.send({ embeds: [embed] })

    const audio = createAudioResource(song.stream, { inputType: song.type })
    player.play(audio)

    client.queue[message.guild.id].player = player
    client.queue[message.guild.id].audio = audio

    player.on("stateChange", (_, newOne) => {
        if (newOne.status !== "idle") return
        const e = client.queue[message.guild.id]
        if (!e?.songs[0].loop) e.songs.shift();
        if (e?.songs[1]) return play(e.songs[0], player, connection)
        setTimeout(() => {
            try {
                if (client.queue[message.guild.id]?.songs[0]) return
                delete client.queue[message.guild.id]
                connection.destroy()
            } catch (err) {
                console.log(error)
            }
        }, 60000)
    })

    player.on("error", console.log)
}

export default {
    name: "play",
    category: "music",
    description: "plays a \"song\" in vc",
    aliases: ["p"],
    cooldown: 5,
    async execute(message, client, args) {
        if (!args) return message.reply("invalid arguments")
        const channel = message.member.voice.channel
        if (!channel) return message.reply("You should join a voice channel first.")

        message.channel.send(`searching for \`${args.join(" ")}\``)
        const isURL = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi
        const link = isURL.test(args.join("")) ? args.join("") : await Youtube(encodeURIComponent(args.join("+")), 1)
            .catch(() => message.reply("oops seems like i can't find anything for that"))
        const connection = getVoiceConnection(channel.guild.id)
        const info = await playdl.video_basic_info(link)
        const song = new Song(info, link, message.author)
        if (!client.queue[message.guild.id]) client.queue[message.guild.id] = { songs: [], skip: 0 }
        client.queue[message.guild.id].songs.push(song)

        if (connection && client.queue[message.guild.id].songs.length !== 1) return message.channel.send(`Added **\`${info.video_details.title}\`** to the queue.`)
        const player = createAudioPlayer()
        const makeConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        })
        makeConnection.subscribe(player)
        play(song, player, makeConnection, message, client)
    }
}