const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const R6Info = require('@silver-3/r6-info');

module.exports = {
    /**
     * * @param {Discord.CommandInteraction} interaction 
     * @param {Discord.Client} client 
     */
    usage: 'random-operator <team>',
    run: async (interaction, client, db) => {
        const team = interaction.options.getString('team');

        let operatorList = team == 'attack' ? R6Info.getAttackers() : R6Info.getDefenders();
        operatorList = operatorList.map(operator => {
            return operator[Object.keys(operator)[0]].name.toLowerCase();
        });

        async function checkOperator(operator) {
            const usedOperators = await db.get(`${interaction.user.id}.operators.${team}`);
            operator = operator.toLowerCase();

            if (Array.isArray(usedOperators) && operatorList.includes(operator) && usedOperators.includes(operator)) {
                return true;
            } else {
                return false;
            }
        }

        async function randomOperator() {
            const checkedOperators = new Set();

            if (await db.has(interaction.user.id) && await db.get(`${interaction.user.id}.operators`)) {
                while (checkedOperators.size < operatorList.length) {
                    const operator = operatorList[Math.floor(Math.random() * operatorList.length)];

                    if (!checkedOperators.has(operator) && !(await checkOperator(operator))) {
                        return operator;
                    }

                    checkedOperators.add(operator);
                }
            } else {
                return operatorList[Math.floor(Math.random() * operatorList.length)];
            }
        }

        await randomOperator().then(async (operator) => {
            operator = R6Info.getOperator(operator);
            const attachment = new Discord.AttachmentBuilder(operator.icon);

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('loadout')
                    .setLabel('Randomize loadout?')
                    .setStyle(Discord.ButtonStyle.Secondary)
                )

            const embed = new Discord.EmbedBuilder()
                .setTitle(`The random operator is: ${operator.name}`)
                .setAuthor({ name: `Requested by: ${interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
                .setThumbnail(`attachment://icon.png`)
                .setColor('Blurple')
                .addFields({
                    name: 'Loadout',
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
                    name: 'Primary Weapons',
                    value: operator.guns.primary.join(' | '),
                    inline: true
                }, {
                    name: 'Secondary Weapons',
                    value: operator.guns.secondary.join(' | '),
                    inline: true
                }, {
                    name: 'Gadgets',
                    value: operator.gadgets.join(' | '),
                    inline: true
                }, {
                    name: 'Information',
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
                    name: `Ability: ${operator.ability.name}`,
                    value: operator.ability.description,
                    inline: true
                }, {
                    name: 'Specialties',
                    value: operator.specialties.join(', '),
                    inline: true
                }, {
                    name: 'Stats',
                    value: `Health: ${operator.stats.health}\nSpeed: ${operator.stats.speed}\nDifficulty: ${operator.stats.difficulty}`,
                    inline: true
                }, )

            if (await db.has(interaction.user.id)) {
                embed.setFooter({
                    text: 'Note: This operator has been added to used operators. Disable this with /remember disable'
                });
                embed.addFields({
                    name: ' ',
                    value: `\n\n*You can view your used operators with \`/used-operators\`*`,
                }, )

                db.push(`${interaction.user.id}.operators.${team}`, operator.name.toLowerCase());
            }

            const response = await interaction.reply({
                embeds: [embed],
                files: [attachment],
                components: [row]
            });

            const collector = await response.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button,
                time: 30_000
            });

            collector.on('collect', async (i) => {
                if (i.customId == 'loadout') {
                    const primarys = operator.guns.primary;
                    const secondarys = operator.guns.secondary;
                    const gadgets = operator.gadgets;

                    const loadout = {
                        primary: primarys.length ? primarys[Math.floor(Math.random() * primarys.length)] : 'None',
                        secondary: secondarys.length ? secondarys[Math.floor(Math.random() * secondarys.length)] : 'None',
                        gadget: gadgets.length ? gadgets[Math.floor(Math.random() * gadgets.length)] : 'None'
                    }

                    embed.data.fields[0].name = 'Randomized loadout';
                    embed.data.fields[3].name = 'Primary Weapon', embed.data.fields[3].value = loadout.primary;
                    embed.data.fields[4].name = 'Secondary Weapon', embed.data.fields[4].value = loadout.secondary;
                    embed.data.fields[5].name = 'Gadget', embed.data.fields[5].value = loadout.gadget;

                    await i.update({
                        embeds: [embed],
                        components: []
                    });
                }
            });

            collector.on('end', () => {
                interaction.editReply({
                    embeds: [embed],
                    components: []
                });
            })
        }).catch(error => {
            const embed = new Discord.EmbedBuilder()
                .setTitle('All operators have been used')
                .setColor('Blurple')
                .setDescription(`All operators on ${team} have been used. Use \`/reset\` to reset used operators.`)
                .setFooter({
                    text: 'You can disable remembering used operators with /remember deactivate'
                });

            return interaction.reply({
                embeds: [embed]
            });
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("random-operator")
    .setDescription("Gives you a random operator from selected team")
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
        .setRequired(true));