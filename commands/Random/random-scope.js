const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.run = async (interaction, client) => {
    const scopes = {
        "3.5": [
            "Telescopic A",
            "Telescopic B"
        ],
        "2.5": [
            "Magnified A",
            "Magnified A",
            "Magnified A"
        ],
        "1.0": [
            "Red Dot A",
            "Red Dot B",
            "Red Dot C",
            "Holo A",
            "Holo B",
            "Holo C",
            "Holo D",
            "Reflex A",
            "Reflex B",
            "Reflex C",
            "Iron Sight"
        ]
    };

    const scope2 = interaction.options.getString('magnified') === 'Yes';
    const scope3 = interaction.options.getString('telescopic') === 'Yes';

    const scopesArray = [...scopes['1.0']];
    if (scope2) scopesArray.push(...scopes['2.5']);
    if (scope3) scopesArray.push(...scopes['3.5']);

    const randomNumber = Math.floor(Math.random() * scopesArray.length);
    const randomScope = scopesArray[randomNumber];

    const embed = new Discord.EmbedBuilder()
        .setColor('Blurple')
        .setAuthor({ name: `Requested by: ${interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
        .setDescription(`Your random scope is: ${randomScope}`)

    interaction.reply({ embeds: [embed] });
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("random-scope")
    .setDescription("Gives you a random scope")
    .addStringOption(option => option
        .setName("magnified")
        .setDescription("Do you want to include 2.5x scopes?")
        .addChoices(
            { name: 'Yes', value: 'Yes' },
            { name: 'No', value: 'No' }
        ))
    .addStringOption(option => option
        .setName("telescopic")
        .setDescription("Do you want to include 3.5x scopes?")
        .addChoices(
            { name: 'Yes', value: 'Yes' },
            { name: 'No', value: 'No' }
        ))