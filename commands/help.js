const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    usage: 'help',
    run: async (interaction, client, db) => {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Bots commands')
            .setColor('Blurple')
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        client.commands.forEach(command => {
            embed.addFields(
                { name: '/' + command.usage, value: command.data.description, inline: true }
            )
        });

        interaction.reply({
            embeds: [embed]
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("help")
    .setDescription("View all the bots commands")