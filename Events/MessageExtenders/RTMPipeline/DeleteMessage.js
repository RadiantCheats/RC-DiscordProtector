const PipelineUtil = require("../../../Util/PipelineUtil");

module.exports = async (Client, MockGuild, Message) => {
    const MockChannel = await PipelineUtil.getOtherChannel(Client, MockGuild, Message.channel.id);
    const MockMessage = await PipelineUtil.getOtherMessage(Client, MockChannel, Message.id);

    if (MockMessage) {
        await Client.PipelineCache.Messages.deleteItem(Message.id);
        await MockMessage.delete();
    }
}