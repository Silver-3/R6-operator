const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const chalk = require('chalk').default;

module.exports = {
    name: 'guildCreate',
    once: false,
    /**
     * @param {Discord.Guild} guild
     * @param {Discord.Client} client
     */
    run: async (guild, client) => {
        require(`../handlers/loadCommands`)(client, guild.id);

        console.log('------------------------');
        console.log(chalk.yellow('[EVENT]') + ' added to new guild');
        console.log(chalk.yellow('[EVENT]') + ` guild name is: ${guild.name}`);
        console.log(chalk.yellow('[EVENT]') + ` guild id is: ${guild.id}`);
        console.log(chalk.yellow('[EVENT]') + ` loading slash commands`);
        console.log(chalk.yellow('[EVENT]') + ` searching for channel to send welcome message`);

        const message = `Thanks for adding me to ${guild.name}. View the commands of this bot with \`/help\``;

        let textChannel = false;

        while(textChannel == false) {
            const randomChannel = guild.channels.cache.random();

            if (randomChannel && randomChannel.send && randomChannel.type == Discord.ChannelType.GuildText) {
                randomChannel.send(message);
                textChannel = true;
                console.log(chalk.yellow('[EVENT]') + ` sent to: #${randomChannel.name}, type: ${Discord.ChannelType[randomChannel.type]}`);
            } else {
                textChannel = false;
                console.log(chalk.yellow('[EVENT]') + ` ignored: ${randomChannel.name}, type: ${Discord.ChannelType[randomChannel.type]}`);
            }
        }
        console.log(chalk.yellow('[EVENT]') + ` guildCreate was successful`);
        console.log('------------------------');
        console.log(' ');
    }
}