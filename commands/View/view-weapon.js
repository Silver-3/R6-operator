const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const R6Info = require('@silver-3/r6-info');

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.autocomplete = async (interaction, client) => {
    const value = interaction.options.getFocused().toLowerCase();
    const choices = R6Info.getAllWeapons().map(x => x.name);

    const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25);

    await interaction.respond(filtered.map(choice => ({
        name: choice,
        value: choice
    })));
}

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 * @param {QuickDB} db
 */

module.exports.run = async (interaction, client, db) => {
    const weaponName = interaction.options.getString('name');
    let weapon;

    let visibleMessage = await db.get(`${interaction.user.id}.invisibleMessages`);
    if (!visibleMessage) visibleMessage = false;

    try {
        weapon = R6Info.getWeapon(weaponName);

        const attachment = new Discord.AttachmentBuilder(weapon.image);
        const embed = new Discord.EmbedBuilder()
            .setTitle(weapon.name)
            .setColor('Blurple')
            .setImage(`attachment://image.png`)
            .setAuthor({
                name: `Requested by: ${interaction.user.globalName? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .addFields({
                name: 'Stats',
                value: ' ',
                inline: true
            }, {
                name: ' ',
                value: ' ',
                inline: true
            }, {
                name: ' ',
                value: ' ',
                inline: true
            }, {
                name: 'Damage',
                value: `${weapon.stats.damage}`,
                inline: true
            }, {
                name: 'Firerate',
                value: `${weapon.stats.firerate == 1 ? `single fire` : `${weapon.stats.firerate} rpm (rounds per minute)`}`,
                inline: true
            }, {
                name: 'Mag',
                value: `${weapon.stats.ammo}`,
                inline: true
            }, {
                name: 'Max capacity',
                value: `${weapon.stats.maxammo}`,
                inline: true
            }, {
                name: 'Control Difficulty',
                value: `${weapon.stats.difficulty}/5`,
                inline: true
            }, {
                name: ' ',
                value: ' ',
                inline: true
            }, {
                name: 'Additional Info',
                value: ' ',
                inline: true
            }, {
                name: ' ',
                value: ' ',
                inline: true
            }, {
                name: ' ',
                value: ' ',
                inline: true
            }, {
                name: 'Gun type',
                value: weapon.type,
                inline: true
            }, {
                name: 'Operators using this weapon',
                value: weapon.operators.join(', '),
                inline: true
            })

        interaction.reply({
            embeds: [embed],
            files: [attachment],
            flags: visibleMessage ? Discord.MessageFlags.Ephemeral : ''
        });
    } catch (error) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Something went wrong')
            .setColor('Red')
            .setDescription('That weapon does not exist. Please check the spelling or use the provided auto complete.')

        console.log(error);

        interaction.reply({
            embeds: [embed],
            flags: Discord.MessageFlags.Ephemeral
        });
    }
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("view-weapon")
    .setDescription("Request a weapon to view")
    .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the weapon you want to view")
        .setRequired(true)
        .setAutocomplete(true))