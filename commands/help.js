const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Bots commands')
            .setColor('Blurple')
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .addFields(
                { name: '/random-operator <attack/defense>', value: 'Gives you a random operator from selected team', inline: true },
                { name: '/remember <activate/deactivate>', value: 'Have the bot remember your used operators so you dont get the same operators again', inline: true },
                { name: '/reset <attack/defense>', value: 'Reset used operators data', inline: true },
                { name: '/used-operators <attack/defense>', value: 'Shows you all the operators you have used', inline: true },
                { name: '/help', value: 'View all the bots commands', inline: true },
            )

        interaction.reply({
            embeds: [embed]
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("help")
    .setDescription("View all the bots commands")