// Require the necessary discord.js classes
// Collection is just better map i guess 
import { ChatInputCommandInteraction, Client, Collection, GatewayIntentBits, SlashCommandBuilder } from "discord.js";

require('dotenv').config();

// reads the commands directory and identify the command files
import fs from 'node:fs';

// path makes paths to access files and directories 
import path from 'node:path';

// ------------

export type CommandType = {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>; 
  };

// -----------

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// constructs path to the events folder
const eventsPath = path.join(__dirname, 'events');

export const commands = new Collection<string, CommandType>();

const commandFiles = fs.readdirSync('./out/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command: CommandType = require(`./commands/${file}`).default;
    commands.set(command.data.name, command);
}

// readdirSync reads the path to the directory and returns an array of files, filter so u only returns js files 
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// for each event that matches a command, run the cmd 
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

