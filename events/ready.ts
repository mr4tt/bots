import { Client } from "discord.js";
import { Events } from 'discord.js';

export default {
    // name states which event this file is for
	name: Events.ClientReady,
    // event should only run once 
	once: true,
    // execute holds event logic 
	execute(client: Client) {
		console.log(`Ready! Logged in as ${client.user!.tag}`);
	},
};