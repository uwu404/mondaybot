import get from "node-fetch"

const Gif = async (search, limit) => {
    const result = await get(`https://api.tenor.com/v1/search?q=${search}&key=${process.env.TENOR}&limit=${limit}`)
        .then(res => res.json())
    return result.results[Math.floor(Math.random() * result.results.length)]
        .media[0]
        .gif.url
}

export default Gif