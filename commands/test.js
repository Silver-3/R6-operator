const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'ping',
    aliases: [],
    category: 'Test',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        interaction.reply("Test");
    }
}

module.exports.data = new SlashCommand()
    .setName("test")
    .setDescription("test")