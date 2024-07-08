const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    usage: 'remember <activate/deactivate>',
    run: async (interaction, client, db) => {
        let choice = interaction.options.getString("choice");
        choice == 'activate' ? choice = true : choice = false;

        const embed = new Discord.EmbedBuilder()
            .setColor('Blurple')
            .setDescription(`Remembering operators is now ${choice == true ? "activated" : "deactivated"}`)

        if (choice) {
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            db.set(`${interaction.user.id}.operatorRemember`, "true");
        } else {
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            db.delete(interaction.user.id);
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("remember")
    .setDescription("Have the bot remember your used operators so you dont get the same operators again")
    .addStringOption(option => option
        .setName("choice")
        .setDescription("Activate/Deactivate the bot remembering your used operators")
        .addChoices(
            { name: 'activate', value: 'activate' },
            { name: 'deactivate', value: 'deactivate' },
        )
        .setRequired(true))