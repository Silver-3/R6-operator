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
        let choice = interaction.options.getString("choice");
        choice == 'activate' ? choice = true : choice = false;

        if (choice) {
            interaction.reply("Remembering operators is now activated.");
            db.set(`${interaction.user.id}.operatorRemember`, "true");
        } else {
            interaction.reply("Remembering operators is now deactivated.");
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