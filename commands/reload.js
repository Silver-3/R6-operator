const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.autocomplete = async (interaction, client) => {
    const value = interaction.options.getFocused().toLowerCase();
    const choices = client.commands.map((command) => command.command.name);
    
    const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25);
    
    await interaction.respond(filtered.map(choice => ({
        name: choice,
        value: choice
    })));
}

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.run = async (interaction, client) => {
    const commandName = interaction.options.getString('command').toLowerCase();
    const command = client.commands.get(commandName);

    try {
        if (!command) return interaction.reply({ content: `❌ Unknown command: ${commandName.toLowerCase()}`, flags: Discord.MessageFlags.Ephemeral });

        delete require.cache[require.resolve(`./${command.command.name}.js`)];

        const updatedCommand = require(`./${command.command.name}.js`);
        client.commands.set(updatedCommand.command.name, updatedCommand);

        interaction.reply({ content: `✅ Reloaded \`${updatedCommand.command.name}\``, flags: Discord.MessageFlags.Ephemeral });
        console.log(`[SLASH-COMMANDS] Reloaded ${updatedCommand.command.name}`);
    } catch (error) {
        interaction.reply({ content: `❌ Failed to reload command, check console for details.`, flags: Discord.MessageFlags.Ephemeral });
        console.error(`[SLASH-COMMANDS] Error reloading command:`, error);
    }
}

module.exports.data = {
    usage: '/reload <command>',
    category: 'Developer'
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload a slash command')
    .addStringOption(option => option
        .setName('command')
        .setDescription('Name of the command to reload')
        .setRequired(true)
        .setAutocomplete(true))