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
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.run = async (interaction, client) => {
    const commandInput = interaction.options.getString('command');
    const categories = new Set();

    if (commandInput) {
        const command = client.commands.get(commandInput.toLowerCase());
        if (!command) return interaction.reply({
            embeds: [client.embed(interaction, `❌ Command ${commandInput} not found`)],
            flags: Discord.MessageFlags.Ephemeral
        });

        const embed = new Discord.EmbedBuilder()
            .setTitle('Additional Information')
            .setColor('Blurple')
            .setAuthor({
                name: interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .addFields({
                name: 'Name',
                value: command.data.name
            }, {
                name: 'Description',
                value: command.data.description
            }, {
                name: 'Usage',
                value: command.data.usage
            }, {
                name: 'Category',
                value: command.data.category
            }, {
                name: 'Restricted?',
                value: command.data.restricted ? 'Yes' : 'No'
            })


        interaction.reply({
            embeds: [embed]
        });
    } else {
        const embed = new Discord.EmbedBuilder()
            .setTitle('List of commands')
            .setColor('Blurple')
            .setAuthor({
                name: interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })

        client.commands.forEach(command => categories.add(command.data.category));

        categories.forEach(category => {
            embed.addFields({
                name: `${category}`,
                value: client.commands.filter(command => command.data.category == category).map(command => `\`${command.data.usage}\` - ${command.data.description}`).join('\n')
            });
        });

        interaction.reply({
            embeds: [embed]
        });
    }
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('View all the bots commands')
    .addStringOption(option => option
        .setName('command')
        .setDescription('A command to get more information on')
        .setAutocomplete(true))