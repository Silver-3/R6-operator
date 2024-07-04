const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const r6operators = require('r6operators');

module.exports = {
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const team = interaction.options.getString('team');
        const operatorList = team == 'attack' ? require('../operators.json').attack : require('../operators.json').defense;

        async function checkOperator(operator) {
            const usedOperators = await db.get(`${interaction.user.id}.operators.${team}`);

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

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function operatorStats(name) {
            return r6operators[name].ratings;
        }

        await randomOperator().then(async (operator) => {
            const attachment = new Discord.AttachmentBuilder(`./images/${operator}.png`, {
                name: 'operator.png'
            });

            const embed = new Discord.EmbedBuilder()
                .setTitle(`The random operator is: ${capitalizeFirstLetter(operator)}`)
                .setDescription(`\nHealth: ${operatorStats(operator).health}\nSpeed: ${operatorStats(operator).speed}\nDifficulty: ${operatorStats(operator).difficulty}`)
                .setThumbnail('attachment://operator.png')
                .setColor('Blurple');

            if (await db.has(interaction.user.id)) {
                embed.setFooter({ text: 'Note: This operator has been added to used operators. Disable this with /remember disable' });
                embed.setDescription(embed.data.description + `\n\n*You can view your used operators with \`/used-operators\`*`);

                db.push(`${interaction.user.id}.operators.${team}`, operator);
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
