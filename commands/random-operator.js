const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
// const r6operators = require('r6operators');
const R6Info = require('@silver-3/r6-info');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
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

                throw new Error("All operators have been used.");
            } else {
                return operatorList[Math.floor(Math.random() * operatorList.length)];
            }
        }

        await randomOperator().then(async (operator) => {
            operator = R6Info.getOperator(operator);
            const attachment = new Discord.AttachmentBuilder(operator.icon);

            const embed = new Discord.EmbedBuilder()
                .setTitle(`The random operator is: ${operator.name}`)
                .setDescription(`\nHealth: ${operator.stats.health}\nSpeed: ${operator.stats.speed}\nDifficulty: ${operator.stats.difficulty}`)
                .setThumbnail(`attachment://${operator.name.toLowerCase()}.png`)
                .setColor('Blurple');

            if (await db.has(interaction.user.id)) {
                embed.setFooter({ text: 'Note: This operator has been added to used operators. Disable this with /remember disable' });
                embed.setDescription(embed.data.description + `\n\n*You can view your used operators with \`/used-operators\`*`);

                db.push(`${interaction.user.id}.operators.${team}`, operator.name.toLowerCase());
            }

            interaction.reply({
                embeds: [embed],
                files: [attachment]
            });
        }).catch(error => {
            console.log(error.message);

            const embed = new Discord.EmbedBuilder()
                .setTitle('All operators have been used')
                .setColor('Blurple')
                .setDescription(`All operators on ${team} have been used. Use \`/reset\` to reset used operators.`)
                .setFooter({ text: 'You can disable remembering used operators with /remember deactivate' });

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
