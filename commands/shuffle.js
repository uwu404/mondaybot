export default {
  name: "shuffle",
  category: "music",
  aliases: ["sh", "->"],
  description: "shuffles the server queue",
  execute(message, client) {
    if (!message.member.voice.channel) return message.channel.send("you need to join a voice channel first.")
    const queue = client.queue[message.guild.id]?.songs
    if (!queue) return message.reply("Hmmm seems like there's nothing playing")
    const np = queue[0]
    queue.shift()
    shuffle(queue)
    const shuffled = [np, ...queue]
    client.queue[message.guild.id].songs = shuffled
    message.channel.send("shuffled.")
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}