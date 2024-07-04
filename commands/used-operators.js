const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const fs = require('fs');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const team = interaction.options.getString('team');
        if(!await db.has(interaction.user.id)) return interaction.reply({ content: "You do not have any operators saved in the database. This is likely because you have not enabled remembering operators. Use \`/remember activate\` to activate remebering.", ephemeral: true });
        
        let operatorList = team == 'attack' ? require('../operators.json').attack : require('../operators.json').defense;
        let usedOperators = await db.get(`${interaction.user.id}.operators.${team}`);

        let order_map = new Map();
        operatorList.forEach((item, index) => {
            order_map.set(item, index);
        });

        usedOperators.sort((a, b) => {
            return order_map.get(a) - order_map.get(b);
        });

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function capitalizeArray(array) {
            return array.map(capitalize);
        }

        operatorList = capitalizeArray(operatorList);
        usedOperators = capitalizeArray(usedOperators);

        const embed = new Discord.EmbedBuilder()
            .setTitle('Used Operators on ' + team)
            .setColor('Blurple')
            .setDescription(
            `**You have currently used:**\n${usedOperators.join(', ') || 'None'} (${usedOperators.length}/${operatorList.length})\n\n` +
            `**You have not used:**\n${operatorList.filter(element => !usedOperators.includes(element)).join(', ') || 'None'} (${operatorList.length - usedOperators.length}/${operatorList.length})`)

        interaction.reply({ embeds: [embed] });
    }
}

module.exports.data = new SlashCommand()
    .setName("used-operators")
    .setDescription("Shows you all the operators you have used")
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