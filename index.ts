import { Client, Collection, GatewayIntentBits, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { PostgresReminder } from "./commands/utilities/PostgresReminder";
import { PostgresWatch } from "./commands/utilities/PostgresWatch";
import { ScraperApiWrapper } from "./commands/utilities/ScraperApiWrapper";
import { CommandType } from "./commands/utilities/Types"

require('dotenv').config();

// reads the commands directory and identify the command files
import fs from 'node:fs';

// path makes paths to access files and directories 
import * as path from 'path';

async function index(client: Client<boolean>, commands: Collection<string, CommandType>, cmdPath: string, eventsPath: string) {
	// Set each command
	const commandFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command: CommandType = await import(path.join(__dirname, "..", "out", "commands", file)).then(obj => obj.default);
		commands.set(command.data.name, command);
	}

	// readdirSync reads the path to the directory and returns an array of files, filter so u only returns js files 
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	// for each event that matches a command, run the cmd
	for (const file of eventFiles) {
		const event = await import(path.join(__dirname, "..", "out", "events", file)).then(obj => obj.default);
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

	// Create instance of scraper.
	ScraperApiWrapper.getInstance();
	ScraperApiWrapper.init(process.env.API_URL!, process.env.API_KEY);

	// Start loop to check if we need to remind anyone about classes/reminders
	(async () => {
		PostgresReminder.loop();
		PostgresWatch.loop();
	})();
}

async function loadCommands(cmdPath: string) {
	const commandsList: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
	
	// Grab all the command files from the commands directory you created earlier
	const commandFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));
	
	// Grab the SlashCommandBuildertoJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		console.log(await import(path.join(__dirname, "..", "out", "commands", file)));
		const command = await import(path.join(__dirname, "..", "out", "commands", file)).then(obj => obj.default);
		commandsList.push(command.data.toJSON());
	}
	
	// Construct and prepare an instance of the REST module
	const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

	try {
		console.log(`Started refreshing ${commandsList.length} application (/) commands.`);
		// The put method is used to fully refresh all commands in the guild with the current set
		// if test, then only update commands in test guild
		if (process.argv.slice(2)[0] === "test") {
			console.log("Entering test mode.");
			await rest.put(
				Routes.applicationGuildCommands(process.env.APP_ID!, process.env.GUILD_ID!),
				{ body: commandsList },
			);
		}
		else {
			await rest.put(
				Routes.applicationCommands(process.env.APP_ID!),
				{ body: commandsList },
			);
		}

		console.log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}
export const commands = new Collection<string, CommandType>();
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const cmdPath = path.join(__dirname, "..", "out", "commands");
const eventsPath = path.join(__dirname, 'events');

// load commands 
loadCommands(cmdPath).then(() => {
	index(client, commands, cmdPath, eventsPath);
});