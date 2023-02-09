const { WebEmbed } = require('discord.js-selfbot-v13');
const PipelineUtil = require("../../../Util/PipelineUtil");

module.exports = async (Client, RealGuild, Message) => {
    // await Message.delete();

    // Get and check mock channel
    const RealChannel = await PipelineUtil.getOtherChannel(Client, RealGuild, Message.channel.id);
    if (!RealChannel) return new Error("Could not find other channel, only other guild.");

    // Replace channel mentions with real channels
    await Message.mentions.channels.forEach(async (c) => {
        Message.content = Message?.content?.replace(c.id, await PipelineUtil.getOtherMessage(Client, RealChannel, c.id, true));
    })

    // Replace role mentions with real roles
    await Message.mentions.roles.forEach(async (r) => {
        Message.content = Message?.content?.replace(r.id, await PipelineUtil.getOtherRole(Client, RealGuild, r.id, true));
    })

    // Send the message
    try {
        const msg = await RealChannel.send({
            activity: Message?.activity || null,
            tts: Message?.tts || null,
            content: Message?.content || null,
            files: [...Message?.attachments]?.map((a) => a[1]) || null,
            embeds: Message?.embeds || null,
            components: Message?.components || null,
            reply: (Message.type == "REPLY") 
                && (await PipelineUtil.getOtherMessage(Client, RealChannel, Message?.reference?.messageId, true)) ? {
                    messageReference: await PipelineUtil.getOtherMessage(Client, RealChannel, Message?.reference?.messageId, true)
                } : {}
        })
    
        // Update to message cache
        await Client.PipelineCache.Messages.push([msg.id, Message.id]);
    } catch {
        const errEmbed = new WebEmbed()
            .setColor("RED")
            .setDescription("❌ You do not have permissions to send messages in this channel.")
        return Message.channel.send({ embeds: [errEmbed] })
    }
}