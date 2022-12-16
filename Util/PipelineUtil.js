async function getOtherGuild(Client, GuildId, IdOnly = false, FetchData = false) {
    for await (const entry of Client.PipelineCache.Guilds) {
        if (entry.includes(GuildId)) {
            const index = entry.indexOf(GuildId);
            switch (index) {
                case 0: {
                    if (IdOnly) return entry[1];
                    return (FetchData
                        ? await Client.guilds.fetch(entry[1])
                        : await Client.guilds.cache.get(entry[1])
                    );
                }
                case 1: {
                    if (IdOnly) return entry[0];
                    return (FetchData
                        ? await Client.guilds.fetch(entry[0])
                        : await Client.guilds.cache.get(entry[0])
                    );
                }
            }
        }
    }
    return false;
}

async function getOtherRole(Client, OtherGuild, RoleId, IdOnly = false, FetchData = false) {
    for await (const entry of Client.PipelineCache.Roles) {
        if (entry.includes(RoleId)) {
            const index = entry.indexOf(RoleId);
            switch (index) {
                case 0: {
                    if (IdOnly) return entry[1];
                    return (FetchData
                        ? await OtherGuild.roles.fetch(entry[1])
                        : await OtherGuild.roles.cache.get(entry[1])
                    );
                }
                case 1: {
                    if (IdOnly) return entry[0];
                    return (FetchData
                        ? await OtherGuild.roles.fetch(entry[0])
                        : await OtherGuild.roles.cache.get(entry[0])
                    );
                }
            }
        }
    }
    return false;
}

async function getOtherChannel(Client, OtherGuild, ChannelId, IdOnly = false, FetchData = false) {
    for await (const entry of Client.PipelineCache.Channels) {
        if (entry.includes(ChannelId)) {
            const index = entry.indexOf(ChannelId);
            switch (index) {
                case 0: {
                    if (IdOnly) return entry[1];
                    return (FetchData
                        ? await OtherGuild.channels.fetch(entry[1])
                        : await OtherGuild.channels.cache.get(entry[1])
                    );
                }
                case 1: {
                    if (IdOnly) return entry[0];
                    return (FetchData
                        ? await OtherGuild.channels.fetch(entry[0])
                        : await OtherGuild.channels.cache.get(entry[0])
                    );
                }
            }
        }
    }
    return false;
}

async function getOtherMessage(Client, OtherChannel, MessageId, IdOnly = false, FetchData = true) {
    for await (const entry of Client.PipelineCache.Messages) {
        if (entry.includes(MessageId)) {
            const index = entry.indexOf(MessageId);
            switch (index) {
                case 0: {
                    if (IdOnly) return entry[1];
                    else if (FetchData) {
                        return await OtherChannel.messages.fetch(entry[1]);
                    }
                    return await OtherChannel.messages.cache.get(entry[1]);
                }
                case 1: {
                    if (IdOnly) return entry[0];
                    else if (FetchData) {
                        return await OtherChannel.messages.fetch(entry[0]);
                    }
                    return await OtherChannel.messages.cache.get(entry[0]);
                }
            }
        }
    }
    return false;
}

async function hasComponent(Client, MessageId, Str) {
    if (!Client.PipelineCache.Components.has(MessageId)) return false;
    for await (const entry of Client.PipelineCache.Components.get(MessageId)) {
        if (entry.includes(Str)) return true;
    }
    return false;
}

async function getRealComponentId(Client, MockMessageId, ReactionStr) {
    for await (const entry of Client.PipelineCache.Components.get(MockMessageId)) {
        if (entry.includes(ReactionStr)) return entry[0];
    }
    return false;
}

module.exports = {
    getOtherGuild,
    getOtherRole,
    getOtherChannel,
    getOtherMessage,
    hasComponent,
    getRealComponentId
};