const PipelineUtil = require("../../../Util/PipelineUtil");

module.exports = async (Client, RealGuild, Message) => {
    const RealChannel = await PipelineUtil.getOtherChannel(Client, RealGuild, Message.channel.id);
    const RealMessage = await PipelineUtil.getOtherMessage(Client, RealChannel, Message.id);

    await Client.PipelineCache.Messages.deleteItem(Message.id);

    try {
        await RealMessage.delete();
    } catch (e) {
        console.log(e)
        throw new Error("Insufficient permissions.");
    }
}