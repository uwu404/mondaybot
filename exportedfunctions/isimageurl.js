import fetch from "node-fetch"

/**
 * @param {string} url 
 * @returns {Promise<boolean>}
 */
async function isImageUrl(url) {
    const urlExp = /\s*https?:\/\/(www\.)?.+\.(png|gif|jpeg|jpg)/gi
    if (!urlExp.test(url)) return false
    const res = await fetch(url)
    const headers = res.headers
    if (!headers) return false
    const type = headers.get("content-type")
    if (!type) return false
    if (type.match(/image\//)) return true
    return false
}

export default isImageUrl