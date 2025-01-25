const Discord = require('discord.js');
const fs = require('fs');

const commands = [];

module.exports = async (client) => {
    fs.readdirSync('./commands/').forEach(dir => {
      const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

      for (const commandFile of commandFiles) {
        const file = require(`../commands/${dir}/${commandFile}`);

        file.data = {
          name: file.command.name,
          description: file.command.description,
          category: dir
        };

        file.command.contexts = [0, 1, 2];
        file.command.integration_types = [0, 1];

        if (file.data.category == 'Developer') file.data.restricted = true;

        let usage = `/${file.command.name}`;

        if (file.command?.options && file.command.options.length > 0) {
          file.command.options.forEach(option => {
            usage += ` ${option.required ? '<' : '['}${option.name}${option.required ? '>' : ']'}`;
          });
        };

        file.data.usage = usage;

        client.commands.set(file.command.name, file);
        commands.push(file.command.toJSON());

        console.log(`[COMMAND] ${file.command.name} has loaded.`);
      }
    });

    console.log("[INFO] Commands have loaded.");
}

module.exports.load = async (client, guildId) => {
    const clientId = client.user?.id;
  
    const rest = new Discord.REST({
      version: '9'
    }).setToken(client.config.token);
  
    try {
      await rest.put(
        Discord.Routes.applicationCommands(clientId, guildId), {
          body: commands,
        }
      ); 
      console.log(`[SLASH-COMMANDS] registered ${commands.length} commands in ${client.guilds.cache.get(guildId).name} (${guildId})`);
    } catch (error) {
      console.error(error);
    }
  };