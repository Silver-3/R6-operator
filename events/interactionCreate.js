const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    name: 'interactionCreate',
    once: false,
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.log(error);
            }
        }

        if (interaction.isButton() && interaction.customId.startsWith('random_')) await client.commands.get('dev-random').button(interaction, client);
        if (interaction.isButton() && interaction.customId == 'challenge') await client.commands.get('random-challenge').button(interaction, client);
        if (interaction.isModalSubmit() && interaction.customId == 'modal_eval') await client.commands.get('eval').modal(interaction, client);
        
        if (!interaction.isCommand()) return;

        const commandName = interaction.commandName

        const command = client.commands.get(commandName);
        if (!command) return

        try {
            if (command.data.category == 'Developer' && !client.config.devId.includes(interaction.user.id)) return interaction.reply({ content: '❌ You aren\'t allowed to use this command', flags: Discord.MessageFlags.Ephemeral });

            await command.run(interaction, client, db);
        } catch (error) {
            interaction.reply("Something went wrong\n" + error.message);
            console.error(error);
        }
    }
}