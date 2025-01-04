const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Discord.Client} client 
     * @param {QuickDB} db
     */
    run: async (client, db) => {
        console.log("[BOT] Bot is online.");

        async function loadCommands() {
            const guilds = client.guilds.cache.map(guild => guild);
            const loadPromises = guilds.map(guild => require('../handlers/commands').load(client, guild.id));
            await Promise.all(loadPromises);
        }
        
        loadCommands().then(() => {
            console.log("[INFO] Slash Commands have loaded.");
        });
    }
}