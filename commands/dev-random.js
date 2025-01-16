const Discord = require('discord.js');
const R6Info = require('@silver-3/r6-info');

async function randomOperator(interaction, team) {
    let operatorList = team == 'attack' ? R6Info.getAttackers() : R6Info.getDefenders();
    operatorList = operatorList.map(operator => {
        return operator[Object.keys(operator)[0]].name.toLowerCase();
    });

    const operator = R6Info.getOperator(operatorList[Math.floor(Math.random() * operatorList.length)]);
    const attachment = new Discord.AttachmentBuilder(operator.icon, { name: `${operator.name.toLowerCase()}.png` });

    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `Requested by: ${interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
        .setColor('Blurple')
        .setDescription(`Your random operator is: ${operator.name}`)
        .setThumbnail(`attachment://${operator.name.toLowerCase()}.png`)

    return { embed, attachment };
}

module.exports.run = async (interaction, client, db) => {
    if (interaction.user.id == client.config.devId) {
        const team = interaction.options.getString('team');
        const channel = interaction?.channel ? interaction.channel : interaction.user;

        const AttackButton = new Discord.ButtonBuilder()
            .setCustomId('random_attack')
            .setLabel('Attack')
            .setStyle(Discord.ButtonStyle.Primary)

        const DefenseButton = new Discord.ButtonBuilder()
            .setCustomId('random_defense')
            .setLabel('Defense')
            .setStyle(Discord.ButtonStyle.Primary)

        const ButtonActionRow = new Discord.ActionRowBuilder()
            .addComponents(AttackButton, DefenseButton)

        const { embed: embed1, attachment: attachment1 } = await randomOperator(interaction, team);
        const { embed: embed2, attachment: attachment2 } = await randomOperator(interaction, team);

        interaction.reply({ content: 'Loading random operators..', flags: Discord.MessageFlags.Ephemeral });
        channel.send({
            embeds: [embed1, embed2],
            files: [attachment1, attachment2],
            components: [ButtonActionRow]
        });
    } else {
        interaction.reply({
            content: 'You aren\'t allowed to use this command',
            flags: Discord.MessageFlags.Ephemeral
        });
    }
}

module.exports.button = async (interaction, client) => {
    if (interaction.user.id == client.config.devId) {
        const team = interaction.customId.replace('random_', '');
        const channel = interaction?.channel ? interaction.channel : interaction.user;

        if (team == 'attack' || team == 'defense') {
            const { embed: embed1, attachment: attachment1 } = await randomOperator(interaction, team);
            const { embed: embed2, attachment: attachment2 } = await randomOperator(interaction, team);

            channel.send({
                embeds: [embed1, embed2],
                files: [attachment1, attachment2],
                components: interaction.message.components
            });

            await interaction.message.delete();
        } else return console.log(`Error: Invalid team: ${team}`);
    }
}

module.exports.data = {
    usage: '/dev-random <team>',
    category: 'Random',
    restricted: true
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("dev-random")
    .setDescription("Gives you a random operator (for dev)")
    .addStringOption(option => option
        .setName('team')
        .setDescription('Attack or Defense team')
        .addChoices({
            name: 'Attack',
            value: 'attack'
        }, {
            name: 'Defense',
            value: 'defense'
        })
        .setRequired(true));