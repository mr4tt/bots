const { SlashCommandBuilder } = require('discord.js');

currentDate = new Date();

//currentDate = new Date('Feburary 17, 2023 00:12:34'); // my tester date
// an ecotime date
ecoDate = new Date('Feburary 3, 2023 00:00:00');
days = Math.round((currentDate - ecoDate) / (1000 * 60 * 60 * 24));
ecotime = days % 14

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ecotime')
		.setDescription('Tells you if it is time to do ecotime'),
	async execute(interaction) {
		// console.log(currentDate)
		if (ecotime === 0)
		{
			await interaction.reply(`ding ding ding ecotime`);
		}
		else {
			await interaction.reply(`no.`)
		}
	},
};