const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const R6Info = require('@silver-3/r6-info');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

function isOperator(name) {
    try {
        R6Info.getOperator(name);
        return true;
    } catch (error) {
        return false;
    }
}

function isWeapon(name) {
    try {
        R6Info.getWeapon(name);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.autocomplete = async (interaction, client) => {
    const value = interaction.options.getFocused().toLowerCase();
    const choices = [...R6Info.getAllOperators().map(x => x.name), ...R6Info.getAllWeapons().map(x => x.name)];

    const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25);

    await interaction.respond(filtered.map(choice => ({
        name: choice,
        value: choice
    })));
}

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 * @param {QuickDB} db
 */

module.exports.run = async (interaction, client, db) => {
    const name = interaction.options.getString("name");

    let visibleMessage = await db.get(`${interaction.user.id}.invisibleMessages`);
    if (!visibleMessage) visibleMessage = false;

    if (isOperator(name)) {
        const operator = R6Info.getOperator(name);
        const loadout = {
            primary: operator.guns.primary.length ? operator.guns.primary[Math.floor(Math.random() * operator.guns.primary.length)] : 'None',
            secondary: operator.guns.secondary.length ? operator.guns.secondary[Math.floor(Math.random() * operator.guns.secondary.length)] : 'None',
            gadget: operator.gadgets.length ? operator.gadgets[Math.floor(Math.random() * operator.gadgets.length)] : 'None'
        };

        const primary = R6Info.getWeapon(loadout.primary);
        const secondary = R6Info.getWeapon(loadout.secondary);
        const gadget = R6Info.getGadget(loadout.gadget);

        const canvas = createCanvas(1200, 600);
        const ctx = canvas.getContext('2d');

        const background = await loadImage('./util/background.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const operatorImage = await loadImage(operator.image);
        ctx.drawImage(operatorImage, 850, 100, 300, 450);

        const primaryImage = await loadImage(primary.image);
        ctx.drawImage(primaryImage, 50, 50, 500, 120);
        ctx.font = '28px Sans';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(primary.name, 50, 40);

        const secondaryImage = await loadImage(secondary.image);
        ctx.drawImage(secondaryImage, 50, 250, 500, 120);
        ctx.fillText(secondary.name, 50, 240);

        const gadgetImage = await loadImage(gadget.image);
        ctx.drawImage(gadgetImage, 50, 450, 500, 120);
        ctx.fillText(gadget.name, 50, 440);

        ctx.font = '32px Sans';
        ctx.fillText(operator.name, 850, 80);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync('./loadout.png', buffer);

        const attachment = new Discord.AttachmentBuilder('./loadout.png', {
            name: 'loadout.png'
        });
        interaction.reply({
            content: 'Here is your loadout',
            files: [attachment],
            flags: visibleMessage ? Discord.MessageFlags.Ephemeral : ''
        });

        setTimeout(() => {
            fs.unlinkSync('./loadout.png');
        }, 2000);
    } else if (isWeapon(name)) {
        interaction.reply({
            content: 'Weapon loadouts are currently disabled',
            flags: [Discord.MessageFlags.Ephemeral]
        });
    }
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName("random-loadout")
    .setDescription("Gives you a random loadout on a chosen operator or weapon")
    .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the operator or weapon")
        .setRequired(true)
        .setAutocomplete(true))


/** 
if (isOperator(name)) {
    const operator = R6Info.getOperator(name);
    const attachment = new Discord.AttachmentBuilder(operator.icon);

    const loadout = {
        primary: operator.guns.primary.length ? operator.guns.primary[Math.floor(Math.random() * operator.guns.primary.length)] : 'None',
        secondary: operator.guns.secondary.length ? operator.guns.secondary[Math.floor(Math.random() * operator.guns.secondary.length)] : 'None',
        gadget: operator.gadgets.length ? operator.gadgets[Math.floor(Math.random() * operator.gadgets.length)] : 'None'
    };

    const primaryWeapon = R6Info.getWeapon(loadout.primary);
    const primaryLoadout = R6Info.randomLoadout(loadout.primary);

    const secondaryWeapon = R6Info.getWeapon(loadout.secondary);
    const secondaryyLoadout = R6Info.randomLoadout(loadout.secondary);

    const embed = new Discord.EmbedBuilder()
        .setTitle(`Random loadout for ${operator.name}`)
        .setColor('Blurple')
        .setAuthor({
            name: `Requested by: ${interaction.user.globalName? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setThumbnail(`attachment://icon.png`)
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
            name: 'Primary Weapon',
            value: loadout.primary,
            inline: true
        }, {
            name: 'Secondary Weapon',
            value: loadout.secondary,
            inline: true
        }, {
            name: 'Gadget',
            value: loadout.gadget,
            inline: true
        }, )

    const primaryEmbed = new Discord.EmbedBuilder()
        .setColor('Blurple')
        .setTitle('Primary: ' + primaryWeapon.name)
        .addFields({
            name: 'Scope',
            value: primaryLoadout.scope,
            inline: true
        }, {
            name: 'Barrel',
            value: primaryLoadout.barrel,
            inline: true
        }, {
            name: 'Grip',
            value: primaryLoadout.grip,
            inline: true
        })

    const secondaryEmbed = new Discord.EmbedBuilder()
        .setColor('Blurple')
        .setTitle('Secondary: ' + secondaryWeapon.name)
        .addFields({
            name: 'Scope',
            value: secondaryyLoadout.scope == 'Custom Sight' ? 'None' : secondaryyLoadout.scope,
            inline: true
        }, {
            name: 'Barrel',
            value: secondaryyLoadout.barrel,
            inline: true
        }, {
            name: 'Grip',
            value: secondaryyLoadout.grip,
            inline: true
        })

    interaction.reply({
        embeds: [embed, primaryEmbed, secondaryEmbed],
        files: [attachment],
        flags: visibleMessage ? Discord.MessageFlags.Ephemeral : ''
    });
} else if (isWeapon(name)) {
    const weapon = R6Info.getWeapon(name);
    const loadout = R6Info.randomLoadout(name);
    const attachment = new Discord.AttachmentBuilder(weapon.image);

    const embed = new Discord.EmbedBuilder()
        .setTitle(`Random loadout on ${weapon.name}`)
        .setColor('Blurple')
        .setAuthor({
            name: `Requested by: ${interaction.user.globalName? interaction.user.globalName + ` (${interaction.user.username})` : interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setThumbnail('attachment://image.png')
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
            name: 'Scope',
            value: loadout.scope == 'Custom Sight' ? 'None' : loadout.scope,
            inline: true
        }, {
            name: 'Barrel',
            value: loadout.barrel,
            inline: true
        }, {
            name: 'Grip',
            value: loadout.grip,
            inline: true
        }, )

    interaction.reply({
        embeds: [embed],
        files: [attachment],
        flags: visibleMessage ? Discord.MessageFlags.Ephemeral : ''
    });
} else {
    const embed = new Discord.EmbedBuilder()
        .setTitle('Something went wrong')
        .setColor('Red')
        .setDescription(`${name} is not an operator or a weapon. Please check the spelling or use the autocomplete.`)

    interaction.reply({
        embeds: [embed],
        flags: Discord.MessageFlags.Ephemeral
    });
}
*/