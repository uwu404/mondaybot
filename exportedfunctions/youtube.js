import get from "node-fetch"

export default async (q, l) => {
    const result = await get(
        `https://www.googleapis.com/youtube/v3/search?regionCode=UK&part=snippet&key=${process.env.YOUTUBE}&type=video&q=${q}&maxResults=${l}`
    )
        .then(res => res.json())
    return `https://www.youtube.com/watch?v=${result.items[Math.floor(Math.random() * result.items.length)].id.videoId}`
}