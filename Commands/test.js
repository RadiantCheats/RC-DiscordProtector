const { WebEmbed } = require('discord.js-selfbot-v13');

module.exports = {
    name: "test",
    usage: "",
    description: "TEST.",

    run: async (client, message, args) => {
        await client.ServerManager.getServerData(client, "875489105784471562");
    }
}