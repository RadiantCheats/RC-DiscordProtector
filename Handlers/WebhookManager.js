async function getWebhook(client, guildId) {
    const guild = await client.guilds.cache.get(guildId);
    const whColl = await guild.fetchWebhooks();

    if (whColl.size < 1) {
        return await createWebhook(client, guildId);
    } else {
        return whColl.first();
    }
}

async function idToObject(GuildId, WebhookId) {
    const guild = await client.guilds.cache.get(GuildId);
    const whColl = await guild.fetchWebhooks();

    return whColl.find((wh) => wh.id == WebhookId);
}

async function changeWebhookChannel(Webhook, channel) {
    return await Webhook.edit({ channel });
}

async function createWebhook(client, guildId) {
    const guild = await client.guilds.cache.get(guildId);
    const suitableChannel = await (await guild.channels.cache.filter((c) => c.type == "GUILD_TEXT")).first();
    return await suitableChannel.createWebhook("RCDC-Protector");
}

async function editMessage(Webhook, msgId, msgData) {
    return await Webhook.editMessage(msgId, { 
        content: msgData.content,
        embeds: msgData.embeds
    });
}

async function send(Webhook, channelId, msgData) {
    if (Webhook.channelId != channelId) {
        await changeWebhookChannel(Webhook, channelId);
    }

    return await Webhook.send({
        username: msgData?.username,
        avatarURL: msgData?.avatarURL,
        threadId: msgData?.threadId,
        flags: msgData?.flags,

        activity: msgData?.activity,
        tts: msgData?.tts,
        nonce: msgData?.nonce,
        content: msgData?.content,
        embeds: msgData?.embeds,
        allowedMentions: msgData?.allowedMentions,
        files: msgData?.files,
        components: msgData?.components,
        attachments: msgData?.attachments,
        usingNewAttachmentAPI: msgData?.usingNewAttachmentAPI
    })
}

module.exports = {
    getWebhook,
    idToObject,
    changeWebhookChannel,
    createWebhook,
    editMessage,
    send
}