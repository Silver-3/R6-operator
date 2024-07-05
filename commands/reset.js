const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const team = interaction.options.getString('team');

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
            .setDescription(`Are you sure you want to reset your data on used ${team == 'attack' ? 'attacker' : 'defender'} operators?`)
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
            .setDescription(`Data on used ${team == 'attack' ? 'attackers' : 'defenders'} has been reset`)
            .setColor('Blurple')

        const cancelEmbed = new Discord.EmbedBuilder()
            .setTitle('Reset cancelled')
            .setDescription('Reset was cancelled')
            .setColor('Blurple')

        const response = await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        const collectorFilter = i => i.user.id == interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000
            });

            if (confirmation.customId == 'reset_confirm') {
                db.delete(`${interaction.user.id}.operators.${team}`);
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
}

module.exports.data = new SlashCommand()
    .setName("reset")
    .setDescription("Reset used operators data")
    .addStringOption(option => option
        .setName("team")
        .setDescription("Attack or Defense team")
        .addChoices({
            name: 'Attack',
            value: 'attack'
        }, {
            name: 'Defense',
            value: 'defense'
        })
        .setRequired(true))