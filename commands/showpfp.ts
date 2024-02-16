import { SlashCommandBuilder, } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { CommandType } from "..";


export default {
	data: new SlashCommandBuilder()
		.setName('userpfp')
		.setDescription('show the user\'s profile picture'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(`${interaction.user.displayAvatarURL()}`);
	},
} as CommandType;