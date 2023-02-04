// Require the necessary discord.js classes
// Collection is just better map i guess 
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// reads the commands directory and identify the command files
const fs = require('node:fs');

// path makes paths to access files and directories 
const path = require('node:path');

// ------------

client.commands = new Collection();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);