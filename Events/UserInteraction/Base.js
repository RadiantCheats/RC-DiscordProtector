const { WebEmbed } = require('discord.js-selfbot-v13');

module.exports = async (Client, Message) => {
    const args = Message.content.split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = Client.UserCommands.get(cmd) || Client.UserCommands.find((a) => a.aliases && a?.aliases.includes(cmd));

    if (!command) {
        const errorEmbed = new WebEmbed()
            .setColor("RED")
            .setDescription("❌ Command not found.")
        return Message.author.send({ embeds: [errorEmbed] });
    }

    try {
        return await command.run(Client, Message, args)
    } catch (e) {
        console.error(e);
        const errorEmbed = new WebEmbed()
            .setColor("RED")
            .setDescription("❌ An error has occurred using this command.")
        return Message.author.send({ embeds: [errorEmbed] });
    }
}