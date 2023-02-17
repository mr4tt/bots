const { SlashCommandBuilder } = require('discord.js');

// TODO: figure out timezones + daylight savings 

//currentDate = new Date('Feburary 17, 2023 00:12:34'); // my tester date

const ecoDate = new Date('Feburary 3, 2023 00:00:00');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ecotime')
		.setDescription('Tells you if it is time to do ecotime'),
	async execute(interaction) {
		// console.log(currentDate)
		const currentDate = new Date();
		// finding the number of days 
		const days = Math.floor((currentDate - ecoDate) / (1000 * 60 * 60 * 24));
		console.log(days)
		// ecotime is every 2 weeks
		const ecotime = days % 14

		if (ecotime === 0)
		{
			await interaction.reply(`ding ding ding ecotime`);
		}
		else {
			await interaction.reply(`no.`)
		}
	},
};