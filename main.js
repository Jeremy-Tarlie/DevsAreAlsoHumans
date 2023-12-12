const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config");
const loadCommands = require("./Loader/loadCommands");
const loadEvents = require("./Loader/loadEvents");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations,
      
    ],
});

client.color = "#ffffff"
client.commands = new Map();
client.SlashCommandBuilder = require("discord.js").SlashCommandBuilder;
client.login(config.token);

loadCommands(client);
loadEvents(client);

