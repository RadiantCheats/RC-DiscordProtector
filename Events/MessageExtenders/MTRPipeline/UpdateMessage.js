const PipelineUtil = require("../../../Util/PipelineUtil");

module.exports = async (Client, RealGuild, OldMessage, NewMessage, CheckLast) => {
    const RealChannel = await PipelineUtil.getOtherChannel(Client, RealGuild, OldMessage.channel.id);
    const RealMessage = await PipelineUtil.getOtherMessage(Client, RealChannel, NewMessage.id);

    CheckLast = true;
    await RealMessage.edit(NewMessage.content);

    return CheckLast;
}