const { getOtherGuild } = require("../Util/PipelineUtil");
const RTMUpdateChannel = require("./MessageExtenders/RTMPipeline/UpdateChannel");

module.exports = {
	name: 'channelUpdate',
	run: async (Client, OldChannel, NewChannel) => {
        const MockGuild = await getOtherGuild(Client, NewChannel.guildId);
        if (MockGuild && MockGuild.isMock(Client)) return await RTMUpdateChannel(Client, MockGuild, OldChannel, NewChannel);
	}
};