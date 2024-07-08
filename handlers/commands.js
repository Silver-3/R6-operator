const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const chalk = require('chalk').default;

module.exports = async (client) => {
    const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        client.commands.set(command.data.name, command);
        console.log(chalk.blue(`[COMMAND]`) + chalk.whiteBright(` ${command.data.name} has loaded`));
    }

    console.log(chalk.green("[INFO]") + " Commands have loaded.");
}

module.exports.load = async (client, guildId) => {
    const commands = [];
    const clientId = client.user?.id;
  
    const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
  
      commands.push(command.data.toJSON());
    }
  
    const rest = new REST({
      version: '9'
    }).setToken(client.config.token);
  
    try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId), {
          body: commands
        },
      ); 
      console.log(chalk.cyan("[SLASH-COMMANDS]") + ` registered ${commands.length} commands in ${client.guilds.cache.get(guildId).name} (${guildId})`);
    } catch (error) {
      console.error(error);
    }
  };
  