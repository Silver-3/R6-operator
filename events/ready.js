const chalk = require('chalk').default;
const Discord = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Discord.Client} client 
     */
    run: async (client) => {
        console.log(chalk.red("[BOT]") + " Bot is online.");

        async function loadCommands() {
            const guilds = client.guilds.cache.map(guild => guild);
            const loadPromises = guilds.map(guild => require('../handlers/commands').load(client, guild.id));
            await Promise.all(loadPromises);
        }
        
        loadCommands().then(() => {
            console.log(chalk.green("[INFO]") + " Slash Commands have loaded.");
        });
    }
}