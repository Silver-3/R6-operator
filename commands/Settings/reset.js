const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 * @param {QuickDB} db
 */

module.exports.run = async (interaction, client, db) => {
    const team = interaction.options.getString('team');

    let visibleMessage = await db.get(`${interaction.user.id}.invisibleMessages`);
    if (!visibleMessage) visibleMessage = false;

    const confirm = new Discord.ButtonBuilder()
        .setCustomId("reset_confirm")
        .setLabel('Confirm')
        .setStyle(Discord.ButtonStyle.Success)

    const cancel = new Discord.ButtonBuilder()
        .setCustomId("reset_cancel")
        .setLabel('Cancel')
        .setStyle(Discord.ButtonStyle.Danger)

    const row = new Discord.ActionRowBuilder()
        .addComponents(confirm, cancel)

    const embed = new Discord.EmbedBuilder()
        .setTitle('Confirmation')
        .setDescription(`Are you sure you want to reset your data on ${team == 'all' ? 'all used' : `used ${team == 'attack' ? 'attacker' : 'defender'}`} operators?`)
        .setColor('Blurple')
        .setFooter({
            text: 'This can not be undone'
        })

    const timeoutEmbed = new Discord.EmbedBuilder()
        .setTitle('Time ran out')
        .setDescription('No confirmation recieved within 1 minute, cancelling')
        .setColor('Blurple')

    const confirmEmbed = new Discord.EmbedBuilder()
        .setTitle('Reset confirmed')
        .setDescription(`Data on ${team == 'all' ? 'all used' : `used ${team == 'attack' ? 'attacker' : 'defender'}`} operators has been reset`)
        .setColor('Blurple')

    const cancelEmbed = new Discord.EmbedBuilder()
        .setTitle('Reset cancelled')
        .setDescription('Reset was cancelled')
        .setColor('Blurple')

    const response = await interaction.reply({
        embeds: [embed],
        components: [row],
        flags: visibleMessage ? Discord.MessageFlags.Ephemeral : ''
    });

    const collectorFilter = i => i.user.id == interaction.user.id;

    try {
        const confirmation = await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 60_000
        });

        if (confirmation.customId == 'reset_confirm') {
            if (team == 'all') db.delete(`${interaction.user.id}.operators`);
            else db.delete(`${interaction.user.id}.operators.${team}`);

            await confirmation.update({
                embeds: [confirmEmbed],
                components: []
            });
        } else if (confirmation.customId == 'reset_cancel') {
            await confirmation.update({
                embeds: [cancelEmbed],
                components: []
            });
        }
    } catch (error) {
        console.log(error.message);

        await interaction.editReply({
            embeds: [timeoutEmbed],
            components: []
        });
    }
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("reset")
    .setDescription("Reset used operators data")
    .addStringOption(option => option
        .setName("team")
        .setDescription("Attack, Defense or Both teams")
        .addChoices({
            name: 'All',
            value: 'all'
        },{
            name: 'Attack',
            value: 'attack'
        }, {
            name: 'Defense',
            value: 'defense'
        })
        .setRequired(true))