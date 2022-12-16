const { hasComponent, getRealComponentId, getOtherMessage, getOtherChannel, getOtherGuild } = require("../Util/PipelineUtil");

module.exports = {
	name: 'messageReactionAdd',
	run: async (Client, Reaction, User) => {
        if (User.id === Client.user.id) return;
        if (Client.PipelineCache.Components.has(Reaction.message.id)) {
            await Reaction.users.remove(User);
            if (!hasComponent(Client, Reaction.message.id, `${Reaction.emoji.name}:${Reaction.emoji.id || "undefined"}`)) return;

            const RealMessage = await getOtherMessage(Client, await getOtherChannel(Client, await getOtherGuild(Client, Reaction.message.guild.id), Reaction.message.channel.id), Reaction.message.id);
            await RealMessage.clickButton(await getRealComponentId(Client, Reaction.message.id, `${Reaction.emoji.name}:${Reaction.emoji.id || "undefined"}`));
        }
	}
};