import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { generateBlankEmbed } from "./utilities/Util";
import { parseCourseSubjCode } from "./utilities/Util";
import { PostgresWatch } from "./utilities/PostgresWatch";
import { CommandType } from "./utilities/Types";

export default {
    data: new SlashCommandBuilder()
    .setName('deleteclass')
    .setDescription("Remove a class from your watch list")
    .addStringOption((arg) => arg.setName("course")
        .setDescription("Name of course you'd like to remove")
        .setRequired(true)),

    /**
     * @inheritDoc
     */
    async execute(interaction: ChatInputCommandInteraction) {
        const course = interaction.options.getString("course", true);
        
        const parsedCode = parseCourseSubjCode(course);
        if (parsedCode.indexOf(" ") === -1) {
            await interaction.reply({
                content: `Your input, \`${course}\`, is not correctly formatted. It should look like \`SUBJ XXX\`.`,
                ephemeral: true,
            });

            return;
        }

        await interaction.deferReply();

        // if you're not already watching the class
        const searchResults = await PostgresWatch.searchCourse(interaction.user.id, parsedCode);
        if (searchResults.length === 0) {
            await interaction.editReply({
                content: `You aren't watching \`${parsedCode}\`.`,
            });

            return;
        }

        // if course is correctly formatted, store the class in Postgres and return confirmation embed
        PostgresWatch.deleteRow(interaction.user.id, parsedCode);
        
        await interaction.editReply({
            embeds: [generateBlankEmbed(interaction.user)
                .setTitle("Course removed from watch list")
                .setFooter({
                    text: `Server Context: ${interaction.guild?.name ?? "Direct Message @edbird"}`,
                })
                .setDescription(`Removed course: \`${parsedCode}\``)],
        });
    }
} as CommandType