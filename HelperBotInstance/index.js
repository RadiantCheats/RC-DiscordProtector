const Discord = require('discord.js');
const client = new Discord.Client({ intents: 32767 });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.channel.type === 'dm') {
    if (msg.content.startsWith('!decode')) {
      const base64String = msg.content.split(' ')[1];
      const decoded = Buffer.from(base64String, 'base64').toString('utf8');

      console.log(decoded)
    }
  }
});

client.login('MTA1MTE0NDQ0Njc3Njk3NTQwNA.G28CoV.v4C7HT52Z5q-vAgz82i2CAGlA6jU2JESLRWSzo');

async function handle(data) {
    const guild = client.guilds.cache.get(data.gid);
    if (guild && guild.member(msg.author).hasPermission('ADMINISTRATOR')) {
        switch (data.type) {
            case "EDIT": {
                break;
            }
            case "SEND": {
                break;
            }
            default: {}
        }
    }
}