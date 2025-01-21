const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const R6Info = require('@silver-3/r6-info');

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 * @param {QuickDB} db
 */

module.exports.run = async (interaction, client, db) => {
    const error = new Discord.EmbedBuilder()
        .setTitle('Something went wrong')
        .setColor('Red')
        .setDescription(`You do not have remembering operators enabled. Please enable this using \`/remember activate\`.`)

    if (!await db.has(interaction.user.id)) return interaction.reply({
        embeds: [error],
        flags: Discord.MessageFlags.Ephemeral
    });

    // Attacker

    let usedAttackers = await db.get(`${interaction.user.id}.operators.attack`);
    let attackerList = R6Info.getAttackers();
    let attackerMap = new Map();

    attackerList = attackerList.map(operator => {
        return operator[Object.keys(operator)[0]].name.toLowerCase();
    });

    attackerList.forEach((item, index) => {
        attackerMap.set(item, index);
    });

    if (usedAttackers == null || usedAttackers.length == 0) usedAttackers = [];

    usedAttackers.sort((a, b) => {
        return attackerMap.get(a) - attackerMap.get(b);
    });

    // Defender

    let usedDefenders = await db.get(`${interaction.user.id}.operators.defense`);
    let defenderList = R6Info.getDefenders();
    let defenderMap = new Map();

    defenderList = defenderList.map(operator => {
        return operator[Object.keys(operator)[0]].name.toLowerCase();
    });

    defenderList.forEach((item, index) => {
        defenderMap.set(item, index);
    });

    if (usedDefenders == null || usedDefenders.length == 0) usedDefenders = [];

    usedDefenders.sort((a, b) => {
        return defenderMap.get(a) - defenderMap.get(b);
    });

    const capitalizeArray = (array) => array.map(item => item.charAt(0).toUpperCase() + item.slice(1));

    const embed = new Discord.EmbedBuilder()
        .setColor('Blurple')
        .setAuthor({
            name: `Requested by: ${interaction.user.globalName? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .addFields({
            name: 'Attackers',
            value: `**You have currently used:**\n${usedAttackers.length ? capitalizeArray(usedAttackers).join(', ') + ` (${usedAttackers.length}/${attackerList.length})` : 'No used attackers'}\n\n` + `**You have not used:**\n${attackerList.filter(operator => !usedAttackers.includes(operator)).length ? capitalizeArray(attackerList.filter(operator => !usedAttackers.includes(operator))).join(', ') + ` (${attackerList.length - usedAttackers.length}/${attackerList.length})` : 'All attackers used'}`
        },{
            name: '_ _',
            value: '_ _'
        },{
            name: 'Defenders',
            value: `**You have currently used:**\n${usedDefenders.length ? capitalizeArray(usedDefenders).join(', ') + ` (${usedDefenders.length}/${defenderList.length})` : 'No used defenders'}\n\n` + `**You have not used:**\n${defenderList.filter(operator => !usedDefenders.includes(operator)).length ? capitalizeArray(defenderList.filter(operator => !usedDefenders.includes(operator))).join(', ') + ` (${defenderList.length - usedDefenders.length}/${defenderList.length})` : 'All defenders used'}`
        })
    interaction.reply({
        embeds: [embed]
    });
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("used-operators")
    .setDescription("Shows you all the operators you have used")