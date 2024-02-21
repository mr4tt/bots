import { ScraperApiWrapper } from "./utilities/ScraperApiWrapper";
import { generateBlankEmbed, log, parseCourseSubjCode } from "./utilities/Util";
import { PostgresWatch } from "./utilities/PostgresWatch";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandType } from "./utilities/Types";

export default {
    data: new SlashCommandBuilder()
    .setName('watchclass')
    .setDescription(`Input class to watch, get notified if empty seats. 
    Alerts after seats fill up and a spot opens`)
    .addStringOption((arg) => arg.setName("course")
        .setDescription("Name of course to watch")
        .setRequired(true)),

    /**
     * @inheritDoc
     */
    async execute(interaction: ChatInputCommandInteraction) {
        const course = interaction.options.getString("course", true);
        console.log("course", course);
        const parsedCode = parseCourseSubjCode(course);
        console.log(parsedCode);
        if (parsedCode.indexOf(" ") === -1) {
            await interaction.reply({
                content: `Your input, \`${course}\`, is not correctly formatted. It should look like \`SUBJ XXX\`.`,
                ephemeral: true,
            });

            return;
        }

        await interaction.deferReply();

        const [subject, num] = parsedCode.split(" ");

        // make a call to webreg api to see if course exists 
        const courseInfoList = await ScraperApiWrapper.getInstance().getCourseInfo(
            process.env.CURR_TERM!, subject, num);

        if (!courseInfoList || ("error" in courseInfoList) || courseInfoList.length === 0) {
            log("Course Info doesn't exist or error'd", "Scraper API Request", "ERROR");

            await interaction.editReply({
                content: `The course, \`${parsedCode}\`, was not found. Try again.`,
            });

            return;
        }

        // if you're already watching the class
        const searchResults = await PostgresWatch.searchCourse(interaction.user.id, parsedCode);
        if (searchResults.length !== 0) {
            await interaction.editReply({
                content: `You are already watching \`${parsedCode}\`.`,
            });

            return;
        }

        // if course is correctly formatted and insert succeeded, store the class in Postgres and return confirmation embed
        const insert = await PostgresWatch.insertClass(interaction.user.id, parsedCode, interaction.channel!.id);
        if (!insert) {
            await interaction.editReply({
                content: "Sorry, we weren't able to catch your request. Try again later.",
            });

            return;
        }
        
        await interaction.editReply({
            embeds: [generateBlankEmbed(interaction.user)
                .setTitle("Course added to watch list")
                .setFooter({
                    text: `Server Context: ${interaction.guild?.name ?? "Direct Message @edbird"}`,
                })
                .setDescription(`Watching course: \`${parsedCode}\``)],
        });
    },
} as CommandType;