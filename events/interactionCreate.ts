import { Events, Interaction } from 'discord.js';
import { commands } from '..';

// every / command is an interaction
// you need to create a listener for the event

export default {
    // name proper specifies which event this file is for
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};