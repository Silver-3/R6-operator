const Discord = require('discord.js');
const R6Info = require('@silver-3/r6-info');

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.run = async (interaction, client) => {
    const type = interaction.options.getString('type');
    const map = R6Info.randomMap(type);

    const attachment = new Discord.AttachmentBuilder(map.image);
    const embed = new Discord.EmbedBuilder()
        .setTitle(`The random map is: ${map.name}`)
        .setAuthor({
            name: `Requested by: ${interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setColor('Blurple')
        .setImage(`attachment://image.png`)

    interaction.reply({
        embeds: [embed],
        files: [attachment]
    });
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("random-map")
    .setDescription("Get a random map, useful for random map 1v1s")
    .addStringOption(option => option
        .setName("type")
        .setDescription("Type of map")
        .setRequired(true)
        .addChoices({
            name: 'Ranked map',
            value: 'ranked'
        }, {
            name: 'Non ranked map',
            value: 'nonranked'
        }))