const { WebEmbed } = require('discord.js-selfbot-v13');

module.exports = {
    name: "help",
    usage: "",
    description: "Show the help menu.",
    
    run: async (client, message, args) => {
        const getDesc = async () => {
            let str = "";
            for await (const cmd of client.UserCommands) {
                str += `${cmd[1].name}${cmd[1].usage}: ${cmd[1].description}\n`
            }
            return str;
        }

        const helpEmbed = new WebEmbed()
            .setTitle("Help Menu")
            .setColor(client.Config.embedColor)
            .setDescription(await getDesc() + "\n[] = required, () = optional")

        return message.author.send({ embeds: [helpEmbed] });
    }
}