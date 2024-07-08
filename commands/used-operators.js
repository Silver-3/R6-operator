const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const fs = require('fs');
const R6Info = require('@silver-3/r6-info');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    usage: 'used-operators <team>',
    run: async (interaction, client, db) => {
        const team = interaction.options.getString('team');

        const error1 = new Discord.EmbedBuilder()
            .setTitle('Something went wrong')
            .setColor('Red')
            .setDescription(`You do not have remembering operators enabled. Please enable this using \`/remember activate\`.`)

        const error2 = new Discord.EmbedBuilder()
            .setTitle('Something went wrong')
            .setColor('Red')
            .setDescription(`You have not used any operators on ${team} yet. To "use" an operator use \`/random-operator <team>\`.`)

        if (!await db.has(interaction.user.id)) return interaction.reply({
            embeds: [error1],
            ephemeral: true
        });

        let operatorList = team == 'attack' ? R6Info.getAttackers() : R6Info.getDefenders();
        operatorList = operatorList.map(operator => {
            return operator[Object.keys(operator)[0]].name.toLowerCase();
        });
        let usedOperators = await db.get(`${interaction.user.id}.operators.${team}`);

        let order_map = new Map();
        operatorList.forEach((item, index) => {
            order_map.set(item, index);
        });

        if (usedOperators == null || usedOperators.length == 0) return interaction.reply({
            embeds: [error2],
            ephemeral: true
        });
        
        usedOperators.sort((a, b) => {
            return order_map.get(a) - order_map.get(b);
        });

        function capitalize(string) {
            if (typeof string !== 'string') {
                console.error('Expected a string but got:', typeof string, string);
                return string;
            }
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function capitalizeArray(array) {
            return array.map(capitalize);
        }


        const embed = new Discord.EmbedBuilder()
            .setTitle('Used Operators on ' + team)
            .setColor('Blurple')
            .setDescription(
                `**You have currently used:**\n${capitalizeArray(usedOperators).join(', ') || 'None'} (${usedOperators.length}/${operatorList.length})\n\n` +
                `**You have not used:**\n${capitalizeArray(operatorList.filter(element => !usedOperators.includes(element))).join(', ') || 'None'} (${operatorList.length - usedOperators.length}/${operatorList.length})`)

        interaction.reply({
            embeds: [embed]
        });
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