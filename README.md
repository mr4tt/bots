# bots

This Discord bot has these commands:

- writing, checking, and deleting reminders that you can set for a certain time so the bot will ping you about it 
- writing alert, deleting alert, and checking what alerts you've set for when UCSD courses have spots open
- checking if ecotime is due (ecotime is a platform for UCSD workers to put in their hours) 
- misc: set bot's avatar, see your own profile picture

## To use:

1. `git pull` this repo 
2. Fill out your information in .env (sample in .env.sample)
3. `npm i` to download packages
4. `npx tsc` to compile TS to JS into an out/ folder
5. `node out/index.js` to start the bot 
- note: this will both load the commands to Discord and start the bot in your Discord of choice 

