const Discord = require('discord.js');
const mongodb = require('./handlers/mongoDatabase');

const config = require('./config.json');
const client = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits).map((intent) => {
        return Discord.GatewayIntentBits[intent]
    })
});

client.commands = new Discord.Collection();
client.config = config;


(async () => {
    try {
        client.db = await mongodb(config.mongoURL);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
})();

["commands", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(config.token);