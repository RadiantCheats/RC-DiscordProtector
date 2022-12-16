const { getOtherGuild } = require("../Util/PipelineUtil");
const RTMCreateChannel = require("./MessageExtenders/RTMPipeline/CreateChannel");

module.exports = {
	name: 'channelCreate',
	run: async (Client, Channel) => {
        const MockGuild = await getOtherGuild(Client, Channel.guild.id);
        if (MockGuild && MockGuild.isMock(Client)) return await RTMCreateChannel(Client, MockGuild, Channel);
	}
};