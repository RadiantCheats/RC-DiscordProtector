const PipelineUtil = require("../../../Util/PipelineUtil");

module.exports = async (Client, MockGuild, Message) => {
    /*
    if (Message.author.bot && Message.content.length < 1 && Message.embeds.length < 1 && Message.components.length < 1) {
        await Client.PipelineCache.Messages.push([Message.id, msg.id]);
    }
    */

    // Get and check mock channel
    const MockChannel = await PipelineUtil.getOtherChannel(Client, MockGuild, Message.channel.id);
    if (!MockChannel) return new Error("Could not find other channel, only other guild.");

    // Check if message is only viewable by user
    const EphermeralCheck = Message.flags.serialize().EPHEMERAL;

    // Replace channel mentions with mock channels
    await Message.mentions.channels.forEach(async (c) => {
        Message.content = Message?.content?.replace(c.id, await PipelineUtil.getOtherChannel(Client, MockGuild, c.id, true));
    })

    // Replace role mentions with mock roles
    await Message.mentions.roles.forEach(async (r) => {
        Message.content = Message?.content?.replace(r.id, await PipelineUtil.getOtherRole(Client, MockGuild, r.id, true));
    })

    // Replace alt user mention with real user
    Message.content = Message?.content?.replace(Client.user.id, Client.Config.realId);

    const getUsername = async () => {
        const realUsername = Message?.author?.username;
        const nickname = Message?.member?.nickname;
        if (nickname) {
            if (EphermeralCheck) return `${nickname} [${realUsername}] : (ONLY TO YOU)`;
            return `${nickname} [${realUsername}]`
        }
        return EphermeralCheck ? realUsername + " : (ONLY TO YOU)" : realUsername;
    }

    const getAvatarURL = async () => {
        return Message?.member?.avatarURL() || Message?.author?.avatarURL() || null;
    }

    const getThread = async () => {
        return Message.hasThread ? Message.thread.id : null;
    }

    const getFiles = async () => {
        return [...Message?.attachments]?.map((a) => a[1]) || null;
    }

    const getContent = async () => {
        let str = "";
        switch (Message.type) {
            case "REPLY": {
                str += `[➤](<https://discord.com/channels/${MockGuild.id}/${MockChannel.id}/${await PipelineUtil.getOtherMessage(Client, MockChannel, Message?.reference?.messageId, true)}>)`;
                str += " Reply to <@";

                const referenceMsg = await Message.channel.messages.fetch(Message?.reference?.messageId);
                if (referenceMsg?.member?.id === Client.user.id || EphermeralCheck) {
                    str += Client.Config.realId;
                } else {
                    str += referenceMsg?.member?.id;
                }

                str += ">: \n";
                break;
            }
            case "APPLICATION_COMMAND": {}
            case "CONTEXT_MENU_COMMAND": {
                str += `[/] <@${Message?.interaction?.user?.id === Client.user.id ? Client.Config.realId : Message?.interaction?.user?.id}> used \`/${Message?.interaction?.commandName}\``;
                break;
            }
        }
        str += Message.content;
        return str || null;
    }

    Message.sendData = {
        username: await getUsername(),
        avatarURL: await getAvatarURL(),
        threadId: await getThread(),
        flags: Message?.flags || null,
        activity: Message?.activity || null,
        tts: Message?.tts || null,
        content: await getContent(),
        embeds: Message?.embeds || null,
        components: Message?.components || null,
        files: await getFiles(),
    }
    const msg = await Client.MessageManager.sendToMock(Client, MockChannel, Message);

    // Update to message cache
    await Client.PipelineCache.Messages.push([Message.id, msg.id]);
}