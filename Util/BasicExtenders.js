const { Guild, Message, Role, Channel } = require('discord.js-selfbot-v13');

module.exports = async () => {
    Array.prototype.deleteItem = function(id) {
        let index = -1;
        for (const entry of this) {
            if (entry.includes(id)) {
                index = this.indexOf(entry);
                break;
            }
        }
        
        if (index > -1) {
            this.splice(index, 1);
        }
    
        return this;
    };
    
    Guild.prototype.isReal = function(Client) {
        for (const entry of Client.PipelineCache.Guilds) {
            if (entry.includes(this.id)) {
                return entry.indexOf(this.id) === 0;
            }
        }
        throw new Error("Guild is not in pipeline cache.");
    }
    Guild.prototype.isMock = function(Client) {
        return !this.isReal(Client);
    }
    Guild.prototype.isFake = Guild.prototype.isMock;

    Message.prototype.isReal = function(Client) {
        for (const entry of Client.PipelineCache.Messages) {
            if (entry.includes(this.id)) {
                return entry.indexOf(this.id) === 0;
            }
        }
        throw new Error("Message is not in pipeline cache.");
    }
    Message.prototype.isMock = function(Client) {
        return !this.isReal(Client);
    }
    Message.prototype.isFake = Message.prototype.isMock;

    Role.prototype.isReal = function(Client) {
        for (const entry of Client.PipelineCache.Roles) {
            if (entry.includes(this.id)) {
                return entry.indexOf(this.id) === 0;
            }
        }
        throw new Error("Role is not in pipeline cache.");
    }
    Role.prototype.isMock = function(Client) {
        return !this.isReal(Client);
    }
    Role.prototype.isFake = Role.prototype.isMock;

    Channel.prototype.isReal = function(Client) {
        for (const entry of Client.PipelineCache.Channels) {
            if (entry.includes(this.id)) {
                return entry.indexOf(this.id) === 0;
            }
        }
        throw new Error("Channel is not in pipeline cache.");
    }
    Channel.prototype.isMock = function(Client) {
        return !this.isReal(Client);
    }
    Channel.prototype.isFake = Channel.prototype.isMock;
}