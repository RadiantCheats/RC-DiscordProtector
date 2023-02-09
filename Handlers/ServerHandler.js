const { Constants } = require('discord.js-selfbot-v13');
const { saveToFile } = require("../Util/ParseData");
const { getOtherChannel } = require("../Util/PipelineUtil");

/**
 * @deprecated
 */
async function saveServers(client) {
    const guildData = new Map();
    for await (let guild of await client.guilds.fetch()) {
        guild = await client.guilds.fetch(guild[1].id);
        let roles = new Map();
        let channels = new Map();

        for await (let role of await guild.roles.fetch()) {
            role = role[1];
            roles.set(role.id, {
                id: role.id,
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                position: role.rawPosition,
                permissions: role.permissions.ALL,
                mentionable: role.mentionable,
            })
        }

        for await (let channel of await guild.channels.fetch()) {
            channel = channel[1];
            const messages = new Map();
            const permissionOverwrites = new Map();
            /*
            if (channel.type == 'GUILD_TEXT') {
                for await (let message of await channel.messages.fetch({ limit: 15 })) {
                    message = message[1];
                    if (message)
                    messages.set(message.id, {
                        content: message.content,

                    });
                }
            }
            */
           
            for await (let permOverwrite of [...channel.permissionOverwrites.cache]) {
                permOverwrite = permOverwrite[1];
                permissionOverwrites.set(permOverwrite.id, {
                    id: permOverwrite.id,
                    type: permOverwrite.type,
                    deny: permOverwrite.deny,
                    allow: permOverwrite.allow
                })
            }

            const tempChannelForPos = await guild.channels.fetch(channel.id);

            channels.set(channel.id, {
                id: channel.id,
                parentId: channel.parentId,
                type: channel.type,
                name: channel.name,
                topic: channel.topic,
                nsfw: channel.nsfw,
                bitrate: channel.bitrate || null,
                userLimit: channel.userLimit || null,
                rtcRegion: channel.rtcRegion || null,
                videoQualityMode: channel.videoQualityMode || null,
                permissionOverwrites: [...permissionOverwrites].map((pm) => pm[1]),
                rateLimitPerUser: channel.rateLimitPerUser || null,
                // messages: [...messages],
                position: tempChannelForPos.rawPosition,
            })
        }

        roles = [...roles].map((c) => c[1])

        channels = [...channels].map((c) => c[1]);
        channels = channels.sort((a, b) => Constants.ChannelTypes[b.type] - Constants.ChannelTypes[a.type]);
        //channels = channels.sort((a, b) => b.position - a.position);

        guildData.set(guild.id, {
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            roles,
            channels
        })
    }
    //guildData = [...guildData].map((g) => g[1]);
    //guildData = [...guildData].sort((a, b) => b[1] - a[1]);
    await saveToFile([...guildData].map((g) => g[1]), "./Data/guildData.json");
}

async function getServerData(Client, GuildId) {
    const Guild = await Client.guilds.cache.get(GuildId);

    const roles = await getRoles(Guild);
    const channels = await getChannels(Guild);
    // const emojis = await getEmojis(Guild);
    const isCommunity = Guild.features.includes("COMMUNITY");

    return {
        id: Guild.id,
        name: Guild.name,
        icon: Guild.icon,
        roles,
        channels,
        // emojis,
        isCommunity
    };
} 

async function createServer(Client, data) {
    const channels = [];
    const communityOnlyChannels = [];
    const channelEveryoneCheck = [];
    const roles = [];

    // parse categories/channels and also push @everyone permissions
    for await (const category of data.channels.categories) {
        for await (const permission of category.permissions) {
            if (permission.id === data.id) {
                channelEveryoneCheck.push({
                    cid: category.id,
                    allow: permission.allow,
                    deny: permission.deny
                })
            }
        }
        channels.push({
            id: category.id,
            name: category.name,
            type: "GUILD_CATEGORY",
            permissionOverwrites: category.permissions
        })
        for await (const channel of category.children) {
            for await (const permission of channel.permissions) {
                if (permission.id === data.id) {
                    channelEveryoneCheck.push({
                        cid: channel.id,
                        allow: permission.allow,
                        deny: permission.deny
                    })
                }
            }

            if (["GUILD_TEXT", "GUILD_VOICE", "GUILD_CATEGORY"].includes(channel.type)) {
                channels.push({
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    parentId: channel.parent,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate ? ((channel.bitrate > 96000) ? 96000 : channel.bitrate) : null,
                    userLimit: channel.userLimit ? ((channel.userLimit > 99) ? 99 : channel.userLimit) : null,
                    rateLimitPerUser: channel.rateLimitPerUser ? channel.rateLimitPerUser : null,
                    permissionOverwrites: channel.permissions
                })
            } else {
                communityOnlyChannels.push({
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    parentId: channel.parent,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate ? ((channel.bitrate > 96000) ? 96000 : channel.bitrate) : null,
                    userLimit: channel.userLimit ? ((channel.userLimit > 99) ? 99 : channel.userLimit) : null,
                    rateLimitPerUser: channel.rateLimitPerUser ? channel.rateLimitPerUser : null,
                    permissionOverwrites: channel.permissions
                })
            }
        }
    }

    // fix roles, should be reversed
    const highestNum = Math.max(...data.roles.map(o => o.position));
    data.roles = data.roles.reverse();
    for (let i = 0; i < highestNum; i++) {
        data.roles.position = i;
    }

    // parse roles, skip @everyone role
    for await (const role of data.roles) {
        if (role.isEveryone) continue;
        roles.push(role);
    }

    // create guild
    const mockGuild = await Client.guilds.create(data.name, {
        channels,
        roles,
        icon: `https://cdn.discordapp.com/icons/${data.id}/${data.icon}.png?size=96`,
        defaultMessageNotifications: 1
    });

    // add bot integration if applicable
    // await mockGuild.addBot(Client.Config.botIntegrationId, "ADMINISTRATOR");

    // make guild community if applicable
    if (data.isCommunity) {
        await mockGuild.setCommunity(true, (await mockGuild.channels.cache.first()).id, (await mockGuild.channels.cache.last()).id, "ua req");
    }

    // add server to cache
    await Client.PipelineCache.Guilds.push([data.id, mockGuild.id]);

    await mockGuild.channels.cache.forEach(async (mockChannel) => {
        for await (const realCategory of data.channels.categories) {
            if (realCategory.name === mockChannel.name) {
                await Client.PipelineCache.Channels.push([realCategory.id, mockChannel.id]);
            }

            for await (const realChannel of realCategory.children) {
                if (realChannel.name === mockChannel.name && realChannel.type === mockChannel.type) {
                    await Client.PipelineCache.Channels.push([realChannel.id, mockChannel.id]);
                }
            }
        }

        for await (const entry of channelEveryoneCheck) {
            if ((entry.cid) == (await getOtherChannel(Client, (await Client.guilds.cache.get(data.id)), mockChannel.id, true))) {
                await mockChannel.permissionOverwrites.set([...await mockChannel.permissionOverwrites.cache.toJSON()].concat([
                    {
                        id: mockChannel.guild.id,
                        type: "role",
                        allow: entry.allow,
                        deny: entry.deny
                    }
                ]))
            }
        }
    })

    // add community channels if community server
    for (const cc of communityOnlyChannels) {
        cc.parent = await getOtherChannel(Client, mockGuild, cc.parentId, true)
        await mockGuild.channels.create(cc.name, cc);
    }

    // fix everyone role perms
    const oldEveryoneRole = await data.roles.find((r) => r.isEveryone);
    await mockGuild.roles.cache.get(mockGuild.id).edit({
        name: oldEveryoneRole.name,
        color: oldEveryoneRole.color,
        permissions: oldEveryoneRole.permissions,
        mentionable: oldEveryoneRole.mentionable
    })

    await mockGuild.roles.cache.forEach(async (mockRole) => {
        for await (const realRole of data.roles) {
            if (realRole.name === mockRole.name && realRole.permissions === await mockRole.permissions.bitfield.toString()) {
                Client.PipelineCache.Roles.push([realRole.id, mockRole.id]);
            }
        }
    })

    return {
        invite: (await mockGuild.invites.create(await mockGuild.channels.cache.first())).code,
        id: mockGuild.id
    }
}

async function deleteServer(Client, MockServer) {

}

module.exports = {
    saveServers,
    getServerData,
    createServer,
    deleteServer
};

async function getRoles(guild) {
    const roles = [];
    await guild.roles.cache
        .filter((role) => !role.managed)
        .sort((a, b) => b.position - a.position)
        .forEach(async (role) => {
            const roleData = {
                id: role.id,
                name: role.name,
                color: role.hexColor,
                hoist: role.hoist,
                permissions: await role.permissions.bitfield.toString(),
                mentionable: role.mentionable,
                position: role.position,
                isEveryone: guild.id === role.id
            };
            roles.push(roleData);
        });
    return roles;
}

async function getChannels(guild) {
    return new Promise(async (resolve) => {
        const channels = {
            categories: [],
            others: []
        };

        // Gets the list of the categories and sort them by position
        const categories = await (guild.channels.cache
            .filter((ch) => ch.type === "GUILD_CATEGORY"))
            .sort((a, b) => a.position - b.position)
            .toJSON();
            
        for await (const category of categories) {
            const categoryData = {
                id: category.id,
                name: category.name, // The name of the category
                permissions: await fetchChannelPermissions(category), // The overwrite permissions of the category
                children: [] // The children channels of the category
            };
            // Gets the children channels of the category and sort them by position
            const children = category.children.sort((a, b) => a.position - b.position).toJSON();
            for (const child of children) {
                // For each child channel
                if (child.type === "GUILD_TEXT" || child.type === "GUILD_NEWS") {
                    const channelData = await fetchTextChannelData(child); // Gets the channel data
                    categoryData.children.push(channelData); // And then push the child in the categoryData
                } else {
                    const channelData = await fetchVoiceChannelData(child); // Gets the channel data
                    categoryData.children.push(channelData); // And then push the child in the categoryData
                }
            }
            channels.categories.push(categoryData); // Update channels object
        }
        // Gets the list of the other channels (that are not in a category) and sort them by position
        const others = (guild.channels.cache
            .filter((ch) => {
                return !ch.parent && ch.type !== "GUILD_CATEGORY"
                    && ch.type !== "GUILD_NEWS_THREAD" && ch.type !== "GUILD_PRIVATE_THREAD" && ch.type !== "GUILD_PUBLIC_THREAD" // threads will be saved with fetchTextChannelData
            }))
            .sort((a, b) => a.position - b.position)
            .toJSON();
        for (const channel of others) {
            // For each channel
            if (channel.type === "GUILD_TEXT" || channel.type === "GUILD_NEWS") {
                const channelData = await fetchTextChannelData(channel); // Gets the channel data
                channels.others.push(channelData); // Update channels object
            } else {
                const channelData = await fetchVoiceChannelData(channel); // Gets the channel data
                channels.others.push(channelData); // Update channels object
            }
        }
        resolve(channels); // Returns the list of the channels
    });
}

async function getEmojis(guild) {
    const emojis = [];
    await guild.emojis.cache.forEach(async (emoji) => {
        emojis.push({
            id: emoji.id,
            name: emoji.name,
            url: emoji.url
        });
    });
    return emojis;
}

async function fetchChannelPermissions(channel) {
    const permissions = [];
    await channel.permissionOverwrites.cache
        .filter((p) => p.type === 'role')
        .forEach(async (perm) => {
            // For each overwrites permission
            const role = await channel.guild.roles.cache.get(perm.id);
            if (role) {
                permissions.push({
                    id: role.id,
                    type: "role",
                    allow: perm.allow.bitfield.toString(),
                    deny: perm.deny.bitfield.toString()
                });
            }
        });
    return permissions;
}

async function fetchVoiceChannelData(channel) {
    return new Promise(async (resolve) => {
        const channelData = {
            id: channel.id,
            type: "GUILD_VOICE",
            name: channel.name,
            bitrate: channel.bitrate,
            userLimit: channel.userLimit,
            parent: channel.parent ? channel.parentId : null,
            permissions: await fetchChannelPermissions(channel)
        };
        resolve(channelData);
    });
}

async function fetchTextChannelData(channel) {
    return new Promise(async (resolve) => {
        const channelData = {
            id: channel.id,
            type: channel.type,
            name: channel.name,
            nsfw: channel.nsfw,
            rateLimitPerUser: channel.type === "GUILD_TEXT" ? channel.rateLimitPerUser : undefined,
            parent: channel.parent ? channel.parentId : null,
            topic: channel.topic,
            permissions: await fetchChannelPermissions(channel),
            messages: [],
            isNews: channel.type === "GUILD_NEWS",
            threads: []
        };
        /* Fetch channel threads */
        if (channel.threads.cache.size > 0) {
            await Promise.all(channel.threads.cache.map(async (thread) => {
                const threadData = {
                    type: thread.type,
                    name: thread.name,
                    archived: thread.archived,
                    autoArchiveDuration: thread.autoArchiveDuration,
                    locked: thread.locked,
                    rateLimitPerUser: thread.rateLimitPerUser,
                    messages: []
                };
                try {
                    // threadData.messages = await fetchChannelMessages(thread, options);
                    channelData.threads.push(threadData);
                } catch {
                    channelData.threads.push(threadData);
                }
            }));
        }
        try {
            // channelData.messages = await fetchChannelMessages(channel, options);
            resolve(channelData);
        } catch {
            resolve(channelData);
        }
    });
}