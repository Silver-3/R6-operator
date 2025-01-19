const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.run = async (interaction, client) => {
    const categories = new Set();

    const embed = new Discord.EmbedBuilder()
        .setTitle('List of commands')
        .setColor('Blurple')
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
        })

    client.commands.forEach(command => categories.add(command.data.category));

    categories.forEach(category => {
        embed.addFields({
            name: category,
            value: client.commands.filter(cmd => cmd.data.category === category).map(cmd => `\`${cmd.data.usage}\` - ${cmd.command.description}`).join('\n')
        })
    });

    interaction.reply({
        embeds: [embed]
    });
}

module.exports.data = {
    usage: '/help',
    category: 'Information'
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('View all the bots commands')