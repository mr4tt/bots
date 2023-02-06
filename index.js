// Require the necessary discord.js classes
// Collection is just better map i guess 
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// reads the commands directory and identify the command files
const fs = require('node:fs');

// path makes paths to access files and directories 
const path = require('node:path');

// ------------

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// constructs path to the commands folder
const commandsPath = path.join(__dirname, 'commands');

// readdirSync reads the path to the directory and returns an array of files, filter so u only returns js files 
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// loop thru each file and set each command into client.commands
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

// every / command is an interaction
// you need to create a listener for the event

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	// if the command is found, execute 
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
