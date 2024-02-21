import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { generateBlankEmbed } from "./utilities/Util";
import { PostgresReminder as PostgresReminder } from "./utilities/PostgresReminder";
import { CommandType } from "./utilities/Types";

export default {
    data: new SlashCommandBuilder()
    .setName('checkreminder')
    .setDescription("Check what upcoming reminders you have."),

    /**
     * @inheritDoc
     */
    async execute(interaction: ChatInputCommandInteraction) {
        const messages = await PostgresReminder.searchByUser(interaction.user.id);
        let formatted = "\n";
        for (const msg of messages) {
            if ("alert_time" in msg) {
                formatted += "* **" + msg.message + "** on " + msg.alert_time.toDateString() + ` \`(id: ${msg.id})\`` + "\n"; 
            }
        }
        // creates embed with reminders
        const remindEmbed = generateBlankEmbed(interaction.user, "Green")
            .setTitle("Reminder information")
            .setFooter({
                text: `Server Context: ${interaction.guild?.name ?? "Direct Message @edbird"}`,
            })
            .setDescription("Your future reminders: " + formatted + "\nTo delete reminders, use the /deleteReminder command with the reminder's id.");
        
        // after user sends slash command, reply with embed and button 
        await interaction.reply({
            embeds: [remindEmbed],
        });
    }
} as CommandType