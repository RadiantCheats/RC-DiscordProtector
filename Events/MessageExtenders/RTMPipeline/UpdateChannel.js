const { Constants } = require('discord.js-selfbot-v13');
const { getOtherChannel, getOtherRole } = require("../../../Util/PipelineUtil");

module.exports = async (Client, MockGuild, OldChannel, NewChannel) => {
    const MockChannel = await getOtherChannel(Client, MockGuild, NewChannel.id);
    if (!MockChannel) { return; }

    const getParent = async () => {
        const parent = await getOtherChannel(Client, MockGuild, NewChannel.parent.id, true);
        if (!parent) return null;
        return parent;
    }

    const getPermissionOverwrites = async () => {
        const newOverwrites = [];
        const poManager = NewChannel.permissionOverwrites;
        await poManager.cache.forEach(async (po) => {
            if (po.id === NewChannel.guildId) {
                newOverwrites.push({
                    id: MockGuild.id,
                    allow: po.allow,
                    deny: po.deny,
                    type: "role"
                })
            } else if (po.id === Client.user.id) {
                newOverwrites.push({
                    id: Client.Config.realId,
                    allow: po.allow,
                    deny: po.deny,
                    type: "member"
                })
            } else if (po.type !== "member") {
                newOverwrites.push({
                    id: (await getOtherRole(Client, MockGuild, po.id, true)),
                    allow: po.allow,
                    deny: po.deny,
                    type: "role"
                })
            }
        })
        return newOverwrites;
    }

    await MockChannel.edit({
        name: NewChannel?.name,
        type: Constants.ChannelTypes[NewChannel?.type],
        position: NewChannel?.position,
        topic: NewChannel?.topic,
        nsfw: NewChannel?.nsfw,
        bitrate: NewChannel?.bitrate,
        userLimit: NewChannel?.userLimit,
        parent: await getParent(),
        lockPermissions: NewChannel?.permissionsLocked,
        permissionOverwrites: await getPermissionOverwrites(),
        rateLimitPerUser: NewChannel?.rateLimitPerUser,
        defaultAutoArchiveDuration: NewChannel?.defaultAutoArchiveDuration,
        rtcRegion: NewChannel?.rtcRegion,
        videoQualityMode: NewChannel?.videoQualityMode,
        flags: NewChannel?.flags,
        availableTags: NewChannel?.availableTags,
        defaultReactionEmoji: NewChannel?.defaultReactionEmoji,
        defaultThreadRateLimitPerUser: NewChannel?.defaultThreadRateLimitPerUser,
        defaultSortOrder: NewChannel?.defaultSortOrder
    })
}