import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type CommandType = {
	// contains data about the command, such as name and cmd description
	data: SlashCommandBuilder;

	/**
	 * Executes a Discord slash command
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>; 
  };