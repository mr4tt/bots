const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pingnish')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply("<@281657106644467713>");
	},
};