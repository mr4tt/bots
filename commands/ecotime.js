// getting the slashcommandbuilder class
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('IsEdBad?')
		.setDescription('Answers the question'),
	async execute(interaction) {
		await interaction.reply('Yes!');
	},
};