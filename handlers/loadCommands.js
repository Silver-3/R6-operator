const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = async (client, guildId) => {
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
  } catch (error) {
    console.error(error);
  }
};
