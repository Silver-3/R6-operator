const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

const fs = require('fs');
const util = require('util');

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 * @param {QuickDB} db 
 */

module.exports.run = async (interaction, client, db) => {
    const codeModal = new Discord.ModalBuilder()
        .setCustomId('modal_eval')
        .setTitle('Code')

    const codeInput = new Discord.TextInputBuilder()
        .setCustomId('code_modal_eval')
        .setLabel('Insert your code here')
        .setStyle(Discord.TextInputStyle.Paragraph)

    const codeInputActionRow = new Discord.ActionRowBuilder()
        .addComponents(codeInput)

    codeModal.addComponents(codeInputActionRow);

    await interaction.showModal(codeModal);
}

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.modal = async (interaction, client) => {
    const codeInput = interaction.fields.getTextInputValue('code_modal_eval');
    const name = interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username;

    try {
        let output = await util.inspect((await eval(codeInput)));

        if (output.includes(client.config.token)) output = output.replace(client.config.token, 'REDACTED');
        if (codeInput.length > 1024) code = "Code has over 1024 characters";

        if (output.length > 1024) {
            const embed = new Discord.EmbedBuilder()
                .setTitle('Evaluation')
                .setColor('Blurple')
                .addFields(
                    [{
                            name: 'Code',
                            value: '```js\n' + codeInput + '```'
                        },
                        {
                            name: 'Output',
                            value: '```sh\nOutput is over embed character limit. Adding output as an attachment.```'
                        }
                    ]
                )
                .setAuthor({
                    name: name,
                    iconURL: interaction.user.displayAvatarURL()
                })

            fs.writeFileSync('./output.sh', output);

            await interaction.reply({
                embeds: [embed],
                files: [{
                    name: 'output.sh',
                    attachment: './output.sh'
                }],
                flags: Discord.MessageFlags.Ephemeral
            });

            setTimeout(() => {
                fs.unlinkSync('./output.sh', function (error) {
                    if (error) return console.error(error);
                })
            }, 1000);
        } else {
            const embed = new Discord.EmbedBuilder()
                .setTitle('Evaluation')
                .setColor('Blurple')
                .addFields(
                    [{
                            name: 'Code',
                            value: "```js\n" + codeInput + "```"
                        },
                        {
                            name: 'Output',
                            value: "```sh\n" + output + "```"
                        }
                    ])
                .setAuthor({
                    name: name,
                    iconURL: interaction.user.displayAvatarURL()
                })

            await interaction.reply({
                embeds: [embed],
                flags: Discord.MessageFlags.Ephemeral
            });
        }
    } catch (error) {
        console.error(error);
        if (error == "Error: Received one or more errors") return;

        const embed = new Discord.EmbedBuilder()
            .addFields({
                name: 'Code',
                value: "```js\n" + codeInput + "```"
            }, {
                name: 'Error',
                value: "```sh\n" + error + "```"
            })
            .setColor('Blurple')
            .setAuthor({
                name: name,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true
                })
            })

        await interaction.reply({
            embeds: [embed],
            flags: Discord.MessageFlags.Ephemeral
        });
    }
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("eval")
    .setDescription("Allows dev to run code")