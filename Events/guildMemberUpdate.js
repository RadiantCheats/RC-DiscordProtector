Array.prototype.diff = function (a) {
    return this.filter(function (i) { return a.indexOf(i) < 0; });
};

const { getOtherGuild } = require("../Util/PipelineUtil");
const RTMMemberUpdate = require("./MessageExtenders/RTMPipeline/MemberUpdate");

module.exports = {
	name: 'guildMemberUpdate',
	run: async (Client, OldMember, NewMember) => {
        if (NewMember.id !== Client.user.id) return;

        const MockGuild = await getOtherGuild(Client, NewMember.guild.id);
        if (MockGuild && MockGuild.isMock(Client)) return await RTMMemberUpdate(Client, MockGuild, OldMember, NewMember);
	}
};