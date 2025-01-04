const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports.run = async (interaction, client, db) => {
    const categories = new Set()

    const embed = new Discord.EmbedBuilder()
        .setTitle('List of commands')
        .setColor('Blurple')
        .setAuthor({
            name: interaction.member.user.username,
            iconURL: interaction.member.displayAvatarURL(),
        })
        .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
        })

    client.commands.forEach(command => categories.add(command.data.category));

    categories.forEach(category => {
        embed.addFields({
            name: category,
            value: client.commands.filter(cmd => cmd.data.category === category).map(cmd => `\`${cmd.data.usage}\` - ${cmd.command.description}`).join('\n'),
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

module.exports.command = new SlashCommand()
    .setName('help')
    .setDescription('View all the bots commands')