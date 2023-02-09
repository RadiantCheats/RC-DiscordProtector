const UIExt = require("./UserInteraction/Base");
const UIMessageReceived = require("./UserInteraction/DMReceived");
const MTRCreateMessage = require("./MessageExtenders/MTRPipeline/CreateMessage");
const RTMCreateMessage = require("./MessageExtenders/RTMPipeline/CreateMessage");

const { getOtherGuild } = require("../Util/PipelineUtil");

module.exports = {
	name: 'messageCreate',
	run: async (Client, Message) => {
        if (Message.channel.type === "DM") {
            if (Message.author.id === Client.Config.realId) {
                return await UIExt(Client, Message);
            } else if ((Message.author.id !== Client.user.id) && (!Message.author.bot)) {
                return await UIMessageReceived(Client, Message);
            }
            return;
        }

        // Mock -> Real
        const RealGuild = await getOtherGuild(Client, Message.guild.id);
        if (RealGuild && RealGuild.isReal(Client) && (Message.author.id === Client.Config.realId)) return await MTRCreateMessage(Client, RealGuild, Message);

        // Real -> Mock
        const MockGuild = await getOtherGuild(Client, Message.guild.id);
        if (MockGuild && RealGuild.isMock(Client) && Message.author.id !== Client.user.id) return await RTMCreateMessage(Client, MockGuild, Message);
	} // && Message.author.id !== Client.user.id
};