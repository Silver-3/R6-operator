const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const commands = [];

module.exports = async (client) => {

    const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));

    for (const commandFile of commandFiles) {
        const file = require(`../commands/${commandFile}`);

        client.commands.set(file.command.name, file);
        commands.push(file.command.toJSON());

        console.log(`[COMMAND] ${file.command.name} has loaded.`);
    }

    console.log("[INFO] Commands have loaded.");
}

module.exports.load = async (client, guildId) => {
    const clientId = client.user?.id;
  
    const rest = new REST({
      version: '9'
    }).setToken(client.config.token);
  
    try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId), {
          body: commands,
        },
      ); 
      console.log(`[SLASH-COMMANDS] registered ${commands.length} commands in ${client.guilds.cache.get(guildId).name} (${guildId})`);
    } catch (error) {
      console.error(error);
    }
  };