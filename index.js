const Discord = require('discord.js-selfbot-v13');

const config = require("./config.js");

const CommandHandler = require("./Handlers/CommandHandler");
const EventHandler = require("./Handlers/EventHandler.js");

const WebhookManager = require("./Handlers/WebhookManager");
const MessageManager = require("./Handlers/MessageManager");
const ServerManager = require("./Handlers/ServerHandler");

const Extenders = require("./Util/BasicExtenders");
class Client extends Discord.Client {
    constructor() {
        super({ checkUpdate: false });
        this.Config = config;
        this.PipelineCache = {
            Guilds: [],
            Roles: [],
            Channels: [],
            Messages: [],
            Components: new Map()
        }
        this.WebhookManager = WebhookManager;
        this.MessageManager = MessageManager;
        this.ServerManager = ServerManager;
        this.UserCommands = new Discord.Collection();
        this.Initialize();
        this.Start(); 
    }

    async Initialize() {
        await Extenders();
        await CommandHandler(this);
        await EventHandler(this);
    }

    async Start() {
        await this.login(config.altToken);
    }
}

new Client();

process.on("unhandledRejection", (err) => {
	console.log(err, 'error');
});
process.on('rejectionHandled', (err) => {
    console.log(err, "error")
})
process.on('uncaughtException', (err) => {
    console.log(err, "error")
})