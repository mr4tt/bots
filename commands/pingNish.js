const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('Ping Nish')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply("<@281657106644467713>");
	},
};