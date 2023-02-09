const MTRUpdateMessage = require("./MessageExtenders/MTRPipeline/UpdateMessage");
const RTMUpdateMessage = require("./MessageExtenders/RTMPipeline/UpdateMessage");
const { getOtherGuild } = require("../Util/PipelineUtil");

var CheckLast = false; 

module.exports = {
	name: 'messageUpdate',
	run: async (Client, OldMessage, NewMessage) => {
        if (NewMessage.channel.type === "DM") return;

        // Real -> Mock
        const MockGuild = await getOtherGuild(Client, NewMessage.guild.id);
        if (MockGuild && MockGuild.isMock(Client) && !CheckLast) {
            return CheckLast = await RTMUpdateMessage(Client, MockGuild, OldMessage, NewMessage, CheckLast);
        }

        if (![Client.user.id, Client.Config.realId].includes(NewMessage.author.id)) return;

        // Mock -> Real
        const RealGuild = await getOtherGuild(Client, NewMessage.guild.id);
        if (RealGuild && MockGuild.isReal(Client)) {
            return CheckLast = await MTRUpdateMessage(Client, RealGuild, OldMessage, NewMessage, CheckLast);
        }
	}
};