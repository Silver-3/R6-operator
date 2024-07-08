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

        client.guilds.cache.forEach(guild => {
            require(`../handlers/commands`).load(client, guild.id);
        });
    }
}