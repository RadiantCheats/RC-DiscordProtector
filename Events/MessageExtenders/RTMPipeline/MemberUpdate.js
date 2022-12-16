module.exports = async (Client, MockGuild, OldMember, NewMember) => {
    const OldRoles = Array.from(OldMember.roles.cache.keys());
    const NewRoles = Array.from(NewMember.roles.cache.keys());

    if (OldRoles !== NewRoles) {
        const RemovedRoles = OldRoles.diff(NewRoles);
        const AddedRoles = NewRoles.diff(OldRoles);

        const RealMember = await MockGuild.members.cache.get(Client.Config.realId);

        if (RemovedRoles.length > 0) {
            const RemovedMockedRole = await Client.Data.ToFake.get(RemovedRoles[0]);
            await RealMember.roles.remove(RemovedMockedRole);
        } else if (AddedRoles.length > 0) {
            const AddedMockedRole = await Client.Data.ToFake.get(AddedRoles[0]);
            await RealMember.roles.add(AddedMockedRole);
        }
    }

    const OldNickname = OldMember.displayName;
    const NewNickname = NewMember.displayName;

    if (OldNickname !== NewNickname) {
        const RealMember = await MockGuild.members.cache.get(Client.Config.realId);
        await RealMember.setNickname(newnick);
    }
}