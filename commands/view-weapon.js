const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const R6Info = require('@silver-3/r6-info');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    usage: 'view-weapon <weapon>',
    autocomplete: async (interaction, client, db) => {
        const value = interaction.options.getFocused().toLowerCase();
        let choices = R6Info.getAllWeapons().map(x => x.name);

        const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25);

        await interaction.respond(filtered.map(choice => ({
            name: choice,
            value: choice
        })));
    },
    run: async (interaction, client, db) => {
        const weaponName = interaction.options.getString('name');
        let weapon;

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
                })
    
            interaction.reply({
                embeds: [embed],
                files: [attachment]
            });
        } catch (error) {
            const embed = new Discord.EmbedBuilder()
                .setTitle('Something went wrong')
                .setColor('Red')
                .setDescription('That weapon does not exist. Please check the spelling or use the provided auto complete.')
            
            console.log(error);

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("view-weapon")
    .setDescription("Request a weapon to view")
    .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the weapon you want to view")
        .setRequired(true)
        .setAutocomplete(true))