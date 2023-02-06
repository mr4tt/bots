const { SlashCommandBuilder } = require('discord.js');

currentDate = Date();
// if currentDate == 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('is it ecotime?')
		.setDescription('Tells you if it is time to do ecotime'),
	async execute(interaction) {
		await interaction.reply(`${currentDate}`);
	},
};