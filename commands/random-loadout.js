const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const R6Info = require('@silver-3/r6-info');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    usage: 'random-loadout <operator>',
    autocomplete: async (interaction, client, db) => {
        const value = interaction.options.getFocused().toLowerCase();
        let choices = R6Info.getAllOperators().map(x => x.name);

        const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25);

        await interaction.respond(filtered.map(choice => ({
            name: choice,
            value: choice
        })));
    },
    run: async (interaction, client, db) => {
        const operatorName = interaction.options.getString("operator");
        let operator;

        try {
            operator = R6Info.getOperator(operatorName);
            const attachment = new Discord.AttachmentBuilder(operator.icon);

            const primarys = operator.guns.primary;
            const secondarys = operator.guns.secondary;
            const gadgets = operator.gadgets;

            const loadout = {
                primary: primarys.length? primarys[Math.floor(Math.random() * primarys.length)] : 'None',
                secondary: secondarys.length? secondarys[Math.floor(Math.random() * secondarys.length)] : 'None',
                gadget: gadgets.length? gadgets[Math.floor(Math.random() * gadgets.length)] : 'None'
            }

            const embed = new Discord.EmbedBuilder()
                .setTitle(`Random loadout for ${operator.name}`)
                .setColor('Blurple')
                .setAuthor({
                    name: `Requested by: ${interaction.user.globalName? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setThumbnail(`attachment://icon.png`)
                .addFields(
                    { name: 'Loadout', value: ' ', inline: true },{ name: ' ', value: ' ', inline: true },{ name: ' ', value: ' ', inline: true },
                    { name: 'Primary Weapon', value: loadout.primary, inline: true },
                    { name: 'Secondary Weapon', value: loadout.secondary, inline: true },
                    { name: 'Gadget', value: loadout.gadget, inline: true },
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
    .setName("random-loadout")
    .setDescription("Gives you a random loadout on a chosen operator")
    .addStringOption(option => option
        .setName("operator")
        .setDescription("The name of the operator")
        .setRequired(true)
        .setAutocomplete(true))