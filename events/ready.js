const chalk = require('chalk').default;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const R6operators = require('r6operators');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Discord.Client} client 
     */
    run: async (client) => {
        console.log(chalk.red("[BOT]") + " Bot is online.");

        client.guilds.cache.forEach(guild => {
            require(`../handlers/loadCommands`)(client, guild.id);
        });
    }
}