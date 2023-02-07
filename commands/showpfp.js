const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userpfp')
		.setDescription('show the user\'s profile picture'),
	async execute(interaction) {
		await interaction.reply(`${interaction.user.displayAvatarURL()}`);
	},
};