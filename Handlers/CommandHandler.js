const fs = require('fs');

module.exports = async (client) => {
    const commands = fs
        .readdirSync(`./Commands`)
        .filter((file) => file.endsWith(".js"));
    for await (const file of commands) {
        const command = await require(`../Commands/${file}`);
        if (command?.disabled) continue;
        client.UserCommands.set(command.name, command);
    }
}