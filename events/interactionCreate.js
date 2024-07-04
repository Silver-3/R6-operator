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
                await command.autocomplete(interaction, client, db);
            } catch (error) {
                console.log(error);
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId == 'delete_eval') return interaction.message.delete();
        }

        if (!interaction.isCommand()) return;

        const commandName = interaction.commandName

        const command = client.commands.get(commandName);
        if (!command) return

        if (command.category == "botdev" && interaction.user.id !== client.config.botdevid) return client.errorEmbed(interaction, 'You are not allowed to use this command', true);

        try {
            await command.run(interaction, client, db);
        } catch (error) {
            throw error;
        }
    }
}