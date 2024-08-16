const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const R6Info = require('@silver-3/r6-info');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    usage: 'random-weapon',
    run: async (interaction, client) => {
        const weapon = R6Info.randomWeapon();

        const attachment = new Discord.AttachmentBuilder(weapon.icon);
        const embed = new Discord.EmbedBuilder()
            .setTitle(`The random weapon is: ${weapon.name}`)
            .setAuthor({
                name: `Requested by: ${interaction.user.globalName? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setColor('Blurple')
            .setThumbnail(`attachment://${weapon.name.toLowerCase().replaceAll(' ', '_')}.png`)
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
                value: `${weapon.stats.difficulty}`,
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
            }, {
                name: ' ',
                value: ' ',
                inline: true
            })

        interaction.reply({
            embeds: [embed],
            files: [attachment]
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("random-weapon")
    .setDescription("Gives you a random weapon")