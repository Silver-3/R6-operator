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
    usage: 'view-operator <operator>',
    run: async (interaction, client, db) => {
        const operatorName = interaction.options.getString("operator");
        let operator;

        try {
            operator = R6Info.getOperator(operatorName);

            const attachment = new Discord.AttachmentBuilder(operator.icon);
            const embed = new Discord.EmbedBuilder()
                .setTitle(operator.name)
                .setThumbnail(`attachment://${operatorName.toLowerCase()}.png`)
                .setColor('Blurple')
                .addFields(
                    { name: 'Loadout', value: ' ', inline: true },{ name: ' ', value: ' ', inline: true },{ name: ' ', value: ' ', inline: true },
                    { name: 'Primary Weapons', value: operator.guns.primary.join(' | '), inline: true },
                    { name: 'Secondary Weapons', value: operator.guns.secondary.join(' | '), inline: true },
                    { name: 'Gadgets', value: operator.gadgets.join(' | '), inline: true },
                    { name: 'Information', value: ' ', inline: true },{ name: ' ', value: ' ', inline: true },{ name: ' ', value: ' ', inline: true },
                    { name: `Ability: ${operator.ability.name}`, value: operator.ability.description, inline: true },
                    { name: 'Specialties', value: operator.specialties.join(', '), inline: true },
                    { name: 'Stats', value: `Health: ${operator.stats.health}\nSpeed: ${operator.stats.speed}\nDifficulty: ${operator.stats.difficulty}`, inline: true },
                    { name: 'Bio', value: ' ', inline: true },{ name: ' ', value: ' ', inline: true },{ name: ' ', value: ' ', inline: true },
                    { name: 'Real name', value: operator.bio.realname, inline: true },
                    { name: 'Organisation', value: operator.bio.org, inline: true },
                    { name: 'Squad', value: operator.bio.squad, inline: true },
                    { name: 'Season release', value: operator.season, inline: true },
                    { name: 'Height (in meters)', value: operator.bio.height, inline: true },
                    { name: 'Weight (in kilograms)', value: operator.bio.weight, inline: true },
                    { name: 'Date of birth', value: operator.bio.dateofbirth, inline: true },
                    { name: 'Place of birth', value: operator.bio.placeofbirth, inline: true}
                )

            interaction.reply({
                embeds: [embed],
                files: [attachment]
            });
        } catch (error) {
            const embed = new Discord.EmbedBuilder()
                .setTitle('Something went wrong')
                .setColor('Red')
                .setDescription(`That operator does not exist. Please check the spelling`)

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("view-operator")
    .setDescription("View any operator information")
    .addStringOption(option => option
        .setName("operator")
        .setDescription("The name of the operator")
        .setRequired(true)
    )
// add autocompletion