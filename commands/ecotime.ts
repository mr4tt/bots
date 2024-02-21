import { SlashCommandBuilder, } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { CommandType } from "./utilities/Types";

// TODO: figure out timezones + daylight savings 

const ecoDate = new Date('Feburary 3, 2023 00:00:00');
const secondsSinceEcoDate = ecoDate.getTime()

export default {
	data: new SlashCommandBuilder()
		.setName('ecotime')
		.setDescription('Tells you if it is time to do ecotime'),

	/**
	 * @inheritDoc
	 */
	async execute(interaction: ChatInputCommandInteraction) {
		const currSeconds = Date.now();
		// finding the number of days 
		const days = Math.floor((currSeconds - secondsSinceEcoDate) / (1000 * 60 * 60 * 24));

		// ecotime is every 2 weeks
		const ecotime = days % 14

		if (ecotime === 0)
		{
			await interaction.reply("ding ding ding ecotime");
		}
		else {
			await interaction.reply("no.")
		}
	},
} as CommandType;