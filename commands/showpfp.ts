import { SlashCommandBuilder, } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { CommandType } from "./utilities/Types";


export default {
	data: new SlashCommandBuilder()
		.setName('showprofilepic')
		.setDescription('Show the user\'s profile picture.'),

	/**
	 * @inheritDoc
	 */
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(`${interaction.user.displayAvatarURL()}`);
	},
} as CommandType;