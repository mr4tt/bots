const { Events } = require('discord.js');

module.exports = {
    // name states which event this file is for
	name: Events.ClientReady,
    // event should only run once 
	once: true,
    // execute holds event logic 
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};