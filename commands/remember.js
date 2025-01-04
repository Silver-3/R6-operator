const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

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
        db.set(`${interaction.user.id}.operatorRemember`, "true");
    } else {
        interaction.reply({
            embeds: [embed],
            flags: Discord.MessageFlags.Ephemeral
        });
        db.delete(interaction.user.id);
    }
}

module.exports.data = {
    usage: '/remember <activate/deactivate>',
    category: 'Settings'
}


module.exports.command = new SlashCommand()
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