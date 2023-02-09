const { WebEmbed } = require('discord.js-selfbot-v13');
const { getOtherGuild } = require("../Util/PipelineUtil");

module.exports = {
    name: "createmockserver",
    usage: " [realserverid]",
    description: "Create a mock server connected to the real server.",

    run: async (client, message, args) => {
        const realServerId = args[0];

        if (!realServerId || !client.guilds.cache.get(realServerId)) {
            const errEmbed = new WebEmbed()
                .setDescription("❌ Please provide a valid server id.")
                .setColor("RED")
            return await message.author.send({ embeds: [ errEmbed ] });
        }

        if (await getOtherGuild(client, realServerId)) {
            const errEmbed = new WebEmbed()
                .setDescription("❌ There is already a mock server for the server you provided.")
                .setColor("RED")
            return await message.author.send({ embeds: [ errEmbed ] });
        }

        await message.author.send("Please wait...").then(async (msg) => {
            const { invite, id } = await client.ServerManager.createServer(
                client, 
                await client.ServerManager.getServerData(client, realServerId)
            );

            return await msg.edit(`Join the server using this invite: https://discord.gg/${invite}.\nThen, come back here and type \`giveroles ${id}\` to get your roles.`)
        })
    }
}