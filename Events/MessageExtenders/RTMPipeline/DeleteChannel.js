const { getOtherChannel } = require("../../../Util/PipelineUtil");

module.exports = async (Client, MockGuild, Channel) => {
    const MockChannel = await getOtherChannel(Client, MockGuild, Channel.id);
    if (!MockChannel) { return; }

    await Client.PipelineCache.Channels.deleteItem(Channel.id);
    await MockChannel.delete();
}