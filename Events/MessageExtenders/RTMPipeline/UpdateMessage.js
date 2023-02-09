const PipelineUtil = require("../../../Util/PipelineUtil");

module.exports = async (Client, MockGuild, OldMessage, NewMessage, CheckLast) => {
    const MockChannel = await PipelineUtil.getOtherChannel(Client, MockGuild, NewMessage.channel.id);
    var MockMessage = await PipelineUtil.getOtherMessage(Client, MockChannel, NewMessage.id);

    do {
        await new Promise(resolve => setTimeout(resolve, 1));
        MockMessage = await PipelineUtil.getOtherMessage(Client, MockChannel, NewMessage.id);
    } while (!MockMessage)

    /*
    const interval = setInterval(async () => {
        MockMessage = await PipelineUtil.getOtherMessage(Client, MockChannel, NewMessage.id);
    }, 1)
    setTimeout(() => {
        clearInterval(interval);
    }, 5000);

    while (!MockMessage) await new Promise(resolve => setTimeout(resolve, 1));
    */

    // Replace channel mentions with mock channels
    await NewMessage.mentions.channels.forEach(async (c) => {
        NewMessage.content = NewMessage?.content?.replace(c.id, await PipelineUtil.getOtherChannel(Client, MockGuild, c.id, true));
    })

    // Replace role mentions with mock roles
    await NewMessage.mentions.roles.forEach(async (r) => {
        NewMessage.content = NewMessage?.content?.replace(r.id, await PipelineUtil.getOtherRole(Client, MockGuild, r.id, true));
    })

    // Replace alt user mention with real user
    NewMessage.content = NewMessage?.content?.replace(Client.user.id, Client.Config.realId);

    if (MockMessage?.content?.includes("[➤]")) {
        const pos1 = MockMessage.content.indexOf(':');
        const replyStr = MockMessage.content.substr(0, MockMessage.content.indexOf(':', pos1 + 1) + 1);
        NewMessage.content = replyStr + "\n" + NewMessage.content;
    } else if (MockMessage?.content?.includes("[/]")) {
        const pos1 = MockMessage.content.indexOf('`');
        const cmdStr = MockMessage.content.substr(0, MockMessage.content.indexOf('`', pos1 + 1) + 1);
        NewMessage.content = cmdStr + "\n" + NewMessage.content;
    }

    CheckLast = false;

    try {
        await Client.WebhookManager.editMessage(
            await Client.WebhookManager.getWebhook(Client, MockGuild.id),
            MockMessage.id,
            {
                content: NewMessage.content || null,
                embeds: NewMessage.embeds || null
            }
        )
    } catch {}

    return CheckLast;
}