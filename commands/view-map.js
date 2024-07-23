const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const R6Info = require('@silver-3/r6-info');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    usage: 'view-map <map>',
    autocomplete: async (interaction, client, db) => {
        const value = interaction.options.getFocused().toLowerCase();
        let choices = R6Info.getAllMaps().map(x => x.name);

        const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25);

        await interaction.respond(filtered.map(choice => ({
            name: choice,
            value: choice
        })));
    },
    run: async (interaction, client, db) => {
        const mapName = interaction.options.getString('name');
        let map;

        try {
            map = R6Info.getMap(mapName);

            const attachment = new Discord.AttachmentBuilder(map.image);
            const embed = new Discord.EmbedBuilder()
                .setTitle(map.name)
                .setColor('Blurple')
                .setImage(`attachment://${map.name.toLowerCase().replace(' ', '')}.png`)
    
            interaction.reply({
                embeds: [embed],
                files: [attachment]
            });
        } catch (error) {
            const embed = new Discord.EmbedBuilder()
                .setTitle('Something went wrong')
                .setColor('Red')
                .setDescription('That map does not exist. Please check the spelling.')
            
            console.log(error);

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("view-map")
    .setDescription("Request a map to view")
    .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the map you want to view")
        .setRequired(true)
        .setAutocomplete(true))