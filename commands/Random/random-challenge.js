const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 * @param {QuickDB} db
 */

module.exports.run = async (interaction, client, db) => {
    const challenges = [
        "Recruit Only",
        "Shield Ops",
        "Knife/Sledge's Hammer Only",
        "Pistol Only",
        "Hip Fire Only",
        "Shotgun Only",
        "Single Fire Only",
        "Full Sprinting Only",
        "Crouched Only",
        "Prone Only",
        "Random Operator (/random-operator)",
        "Random Scope (/random-scope)",
        "Random Loadout (/random-loadout)",
        "Let The Game Pick Your Operator",
        "Burst Fire Only (5 max)",
        "No Drones & Cams",
        "No Sound",
        "Your Least Favourite Operator",
        "Your Least Played Operator"
    ];

    const randomNumber = Math.floor(Math.random() * challenges.length);
    const randomChallenge = challenges[randomNumber];

    let visibleMessage = await db.get(`${interaction.user.id}.invisibleMessages`);
    if (!visibleMessage) visibleMessage = false;

    const embed = new Discord.EmbedBuilder()
        .setColor('Blurple')
        .setAuthor({
            name: `Requested by: ${interaction.user.globalName ? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(`Your random challenge is: ${randomChallenge}`)

    interaction.reply({
        embeds: [embed],
        flags: visibleMessage ? Discord.MessageFlags.Ephemeral : ''
    });
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("random-challenge")
    .setDescription("Gives you a random challenge if you want to try something different")