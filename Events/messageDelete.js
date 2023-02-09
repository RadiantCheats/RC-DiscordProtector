const MTRDeleteMessage = require("./MessageExtenders/MTRPipeline/DeleteMessage");
const RTMDeleteMessage = require("./MessageExtenders/RTMPipeline/DeleteMessage");

const { getOtherGuild } = require("../Util/PipelineUtil");

module.exports = {
        name: 'messageDelete',
        run: async (Client, Message) => {
                if (Message.channel.type === "DM") return;

                // Mock -> Real
                const RealGuild = await getOtherGuild(Client, Message.guild.id);
                if (RealGuild && RealGuild.isReal(Client)) { 
                        if (Message.author.id !== (await Client.WebhookManager.getWebhook(Client, Message.guild.id)).id)
                                return await MTRDeleteMessage(Client, RealGuild, Message);   
                }

                // Real -> Mock
                const MockGuild = await getOtherGuild(Client, Message.guild.id);
                if (MockGuild && MockGuild.isMock(Client)) return await RTMDeleteMessage(Client, MockGuild, Message); 
        }
}