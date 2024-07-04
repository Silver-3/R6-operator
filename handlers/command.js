const fs = require('fs');
const chalk = require('chalk').default;

module.exports = async (client) => {
    const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        client.commands.set(command.data.name, command);
        console.log(chalk.blue(`[Command]`) + chalk.whiteBright(` ${command.data.name} has loaded`));
    }

    console.log(chalk.green("[INFO]") + " Commands have loaded.");
}