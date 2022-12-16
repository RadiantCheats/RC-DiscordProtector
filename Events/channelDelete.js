const Discord = require('discord.js-selfbot-v13');

const { getOtherGuild } = require("../Util/PipelineUtil");
const RTMDeleteChannel = require("./MessageExtenders/RTMPipeline/DeleteChannel");

module.exports = {
	name: 'channelDelete',
	run: async (Client, Channel) => {
        const MockGuild = await getOtherGuild(Client, Channel.guild.id);
        if (MockGuild && MockGuild.isMock(Client)) return await RTMDeleteChannel(Client, MockGuild, Channel);
	}
};