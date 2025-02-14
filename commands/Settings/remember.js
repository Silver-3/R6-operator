const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 * @param {QuickDB} db
 */

module.exports.run = async (interaction, client, db) => {
    let choice = interaction.options.getString("choice");
    choice == 'activate' ? choice = true : choice = false;

    const embed = new Discord.EmbedBuilder()
        .setColor('Blurple')
        .setDescription(`Remembering operators is now ${choice == true ? "activated" : "deactivated"}`)

    if (choice) {
        interaction.reply({
            embeds: [embed],
            flags: Discord.MessageFlags.Ephemeral
        });
        db.set(`${interaction.user.id}.operatorRemember`, true);
    } else {
        interaction.reply({
            embeds: [embed],
            flags: Discord.MessageFlags.Ephemeral
        });
        db.delete(`${interaction.user.id}.operatorRemember`);
        db.delete(`${interaction.user.id}.operators`);
    }
}


module.exports.command = new Discord.SlashCommandBuilder()
    .setName("remember")
    .setDescription("Have the bot remember your used operators so you dont get the same operators again")
    .addStringOption(option => option
        .setName("choice")
        .setDescription("Activate/Deactivate the bot remembering your used operators")
        .addChoices({
            name: 'activate',
            value: 'activate'
        }, {
            name: 'deactivate',
            value: 'deactivate'
        }, )
        .setRequired(true))