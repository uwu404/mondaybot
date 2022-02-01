export default {
    name: "password",
    description: "generates a random string of characters",
    category: "utilities",
    execute(message) {

        const result = [];
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for (let i = 0; i < 20; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        
        message.channel.send(result.join(''))
    }
}