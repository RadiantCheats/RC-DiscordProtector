const { WebEmbed } = require("discord.js-selfbot-v13");
const { getOtherGuild } = require("../Util/PipelineUtil");

module.exports = {
    name: "giveroles",
    usage: " [mockserverid]",
    description: "Give roles to the real account on the mock server.",

    run: async (Client, Message, Args) => {
        const msg = await Message.author.send("Please wait...");

        const MockGuild = await Client.guilds.cache.get(Args[0]);
        const RealGuild = await getOtherGuild(Client, Args[0]);

        if (!RealGuild || !MockGuild) {}
        
        const MockMember = await MockGuild.members.cache.get(Client.Config.realId);;
        if (!MockMember) {
            return await msg.edit({ content: null, embeds: [(new WebEmbed().setColor("RED").setDescription(`❌ You must join the mock server first.`))] });
        }

        const RealMember = await RealGuild.members.cache.get(Client.user.id);
        const Roles = [...RealMember.roles.cache].map((r) => r[1].name).filter((r) => r !== "@everyone");

        let RolesAdded = 0;
        for await (const MockRole of await MockGuild.roles.fetch()) {
            for await (const RealRole of Roles) {
                if (MockRole[1].name === RealRole) {
                    await MockMember.roles.add(MockRole[0]);
                    RolesAdded++;
                }
            }
        }

        return await msg.edit({ content: null, embeds: [(new WebEmbed().setColor("GREEN").setDescription(`✅ Added ${RolesAdded} roles!`))] });
    }
}