import { ChatInputCommandInteraction, ColorResolvable, SlashCommandBuilder } from "discord.js";
import { generateBlankEmbed } from "./utilities/Util";
import { PostgresReminder as PostgresReminder } from "./utilities/PostgresReminder";
import { CommandType } from "./utilities/Types";

export default {
    data: new SlashCommandBuilder()
    .setName('deletereminder')
    .setDescription( "Delete reminders you've previously set."),

    /**
     * @inheritDoc
     */
    async execute(interaction: ChatInputCommandInteraction) {
        const toDelete = interaction.options.getString("delete_id");
        const message = await PostgresReminder.searchByID(toDelete);
        
        const remindEmbed = generateBlankEmbed(interaction.user);
        let color: ColorResolvable = "Green";

        if (toDelete) {
            const deleted = await PostgresReminder.deleteRow(toDelete);

            if (deleted.rowCount === 0) {
                color = "Red";
                remindEmbed
                    .setTitle("Delete Unsuccessful")
                    .setColor(color)
                    .setDescription("Your reminder could not be found. Is the ID correct?");
            }
            else if ("message" in message[0]) {
                remindEmbed
                    .setTitle("Deleted!")
                    .setDescription("Your reminder, " + message[0].message + ", has been deleted.");
            }
        }

        // after user sends in slash command, reply with embed 
        await interaction.reply({
            embeds: [remindEmbed],
        });
    }
} as CommandType