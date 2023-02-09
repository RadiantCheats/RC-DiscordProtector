module.exports = async (Client, Message) => {
    const realUser = await Client.users.cache.get(Client.Config.realId);
    await realUser.send(`Message from ${Message.author.tag}.\n*Messages sent here will not be sent on the other account.*`)
    await realUser.send({
        activity: Message?.activity || null,
        tts: Message?.tts || null,
        content: Message?.content || null,
        files: [...Message?.attachments]?.map((a) => a[1]) || null,
        embeds: Message?.embeds || null,
        components: Message?.components || null,
        reply: Message.type == "REPLY" && await Client.Data.ToReal.get(Message?.reference?.messageId) ? {
            messageReference: await Client.Data.ToReal.get(Message?.reference?.messageId)
        } : {}
    })
}