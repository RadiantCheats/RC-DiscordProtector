const fs = require('fs');

module.exports = async (client) => {
    const eventFiles = fs.readdirSync("./Events").filter(file => file.endsWith('.js'));

    for await (const file of eventFiles) {
        const event = await require(`../Events/${file}`);
        client.on(event.name, (...args) => event.run(client, ...args));
    }
}