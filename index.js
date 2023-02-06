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

// constructs path to the events folder
const eventsPath = path.join(__dirname, 'events');

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// readdirSync reads the path to the directory and returns an array of files, filter so u only returns js files 
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	console.log(event);
	// takes all args returned by the event, then calls  
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

