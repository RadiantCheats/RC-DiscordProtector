const { parseFile } = require("../Util/ParseData");
const StoreData = require('../Events/Intervals/StoreData');

module.exports = {
	name: 'ready',
	run: async (client) => {
        console.log("Ready to recieve requests from " + client.user.tag + "!");

		client.PipelineCache.Guilds = await parseFile("./Data/Guilds.json");
		client.PipelineCache.Roles = await parseFile("./Data/Roles.json");
		client.PipelineCache.Channels = await parseFile("./Data/Channels.json");
		client.PipelineCache.Messages = await parseFile("./Data/Messages.json");

		setInterval(async () => { 
			return await StoreData(client);
		}, 1500);
	}
};