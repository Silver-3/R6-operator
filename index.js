const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

const config = require('./config.json');
const client = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits).map((intent) => {
        return Discord.GatewayIntentBits[intent]
    })
});

client.commands = new Discord.Collection();
client.config = config;
client.db = new QuickDB();

["command", "event"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(config.token);