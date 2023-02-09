const { getOtherChannel } = require("../../../Util/PipelineUtil");

module.exports = async (Client, MockGuild, Channel) => {
    const ParentChannel = await getOtherChannel(Client, MockGuild, Channel?.parentId);
    const MockChannel = await MockGuild.channels.create(Channel.name, {
        parent: ParentChannel ? ParentChannel.id : null,
        type: Channel.type,
        topic: Channel?.topic || null,
        nsfw: Channel?.nsfw || null,
        bitrate: Channel?.bitrate || null,
        userLimit: Channel?.userLimit || null,
        permissionOverwrites: Channel?.permissionOverwrites?.cache || null,
        position: Channel?.position || null,
        rateLimitPerUser: Channel?.rateLimitPerUser || null,
        rtcRegion: Channel?.rtcRegion || null,
        videoQualityMode: Channel?.videoQualityMode || null,
        availableTags: Channel?.availableTags || null,
        defaultReactionEmoji: Channel?.defaultReactionEmoji || null,
        defaultSortOrder: Channel?.defaultSortOrder || null
    })
    await Client.PipelineCache.Channels.push([Channel.id, MockChannel.id]);
}