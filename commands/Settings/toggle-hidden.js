const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 * @param {QuickDB} db
 */

module.exports.run = async (interaction, client, db) => {
    const choice = interaction.options.getString('choice');

    const embed = new Discord.EmbedBuilder()
        .setColor('Blurple')
        .setAuthor({ name: `Requested by: ${interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
        .setDescription(`Your command replies will now be ${choice == true ? 'Invisible' : 'Visible'} to others`)

    interaction.reply({
        embeds: [embed],
        flags: Discord.MessageFlags.Ephemeral
    });

    db.set(`${interaction.user.id}.invisibleMessages`, choice == 'true' ? true : false);
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName('toggle-hidden')
    .setDescription('Toggle whether commands are only shown to you')
    .addStringOption(option => option
        .setName("choice")
        .setDescription("Your choice")
        .setRequired(true)
        .addChoices({
            name: 'invisible',
            value: 'true'
        },{
            name: 'visible',
            value: 'false'
        }))