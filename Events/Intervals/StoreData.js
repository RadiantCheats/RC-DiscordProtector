const { saveToFile } = require("../../Util/ParseData");

module.exports = async function Interval(Client) {
    await saveToFile(Client.PipelineCache.Guilds, "./Data/Guilds.json");
    await saveToFile(Client.PipelineCache.Roles, "./Data/Roles.json");
    await saveToFile(Client.PipelineCache.Channels, "./Data/Channels.json");
    await saveToFile(Client.PipelineCache.Messages, "./Data/Messages.json");
}