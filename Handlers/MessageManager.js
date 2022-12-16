// const { MessageActionRow, MessageButton } = require("discord.js-selfbot-v13");
const { hasComponent } = require("../Util/PipelineUtil");

async function sendToMock(Client, Channel, Message) {
    const MockMessage = await Client.WebhookManager.send(
        await Client.WebhookManager.getWebhook(Client, Channel.guildId),
        Channel.id,
        Message.sendData
    )

    if (!needsAlternative(Message)) return MockMessage;

    // const LinkButtonMAR = new MessageActionRow();

    switch (Client.Config.componentsMethod.toLowerCase()) {
        case "reaction": {
            let i = 0;
            for (const ActionRow of Message.components) {
                for (const Component of ActionRow.components) {
                    if (Component.type === "BUTTON") {
                        if (Component.disabled) continue;
                        if (Component.emoji) {
                            if (hasComponent(Client, MockMessage.id, `${Component.emoji.name}:${Component.emoji.id}`)) {
                                if (Component.emoji.animated) continue;
                                Client.PipelineCache.Components.set(MockMessage.id, [...(Client.PipelineCache.Components.get(MockMessage.id) || []), [Component.customId, `${Component.emoji.name}:${Component.emoji.id}`]])
                            }
                        } /* else if (Component.style === "LINK") {
                            LinkButtonMAR.addComponents(
                                new MessageButton()
                                    .setStyle("LINK")
                                    .setLabel(Component.label)
                                    .setURL(Component.url)
                            )
                        } else */ {
                            const styleInt = Component.style === "PRIMARY" ? 0 : Component.style === "SECONDARY" ? 1 : Component.style === "SUCCESS" ? 2 : 3;
                            if (!hasComponent(Client, MockMessage.id, `${otherEmojis[styleInt]}:undefined`)) {
                                if (i > 10) continue;
                                Client.PipelineCache.Components.set(MockMessage.id, [...(Client.PipelineCache.Components.get(MockMessage.id) || []), [Component.customId, `${emojis[i++]}:undefined`]])
                            } else {
                                Client.PipelineCache.Components.set(MockMessage.id, [...(Client.PipelineCache.Components.get(MockMessage.id) || []), [Component.customId, `${otherEmojis[styleInt]}:undefined`]])
                            }
                        }
                    }
                }
            }

            if (Client.PipelineCache.Components.has(MockMessage.id)) {
                for await (const set of Client.PipelineCache.Components.get(MockMessage.id)) {
                    await MockMessage.react((set[1]).split(':')[0]);
                }
            }
            break;
        }
        case "bot": {
            return;
        }
        default: {}
    }

    return MockMessage;
}

module.exports = {
    sendToMock
}

const emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
const otherEmojis = ["🟦", "⬛️", "✅", "❌"];

async function needsAlternative(MessageData) {
    for (const ActionRow of MessageData.components) {
        for (const Component of ActionRow.components) {
            if (Component.type === "STRING_SELECT") return true;
            if (Component.type === "TEXT_INPUT") return true;
            if (Component.type === "USER_SELECT") return true;
            if (Component.type === "ROLE_SELECT") return true;
            if (Component.type === "MENTIONABLE_SELECT") return true;
            if (Component.type === "CHANNEL_SELECT") return true;
            if (Component.type === "BUTTON") {
                if (Component.style === "LINK") continue;
                else return true;
            }
        }
    }
    return false;
}