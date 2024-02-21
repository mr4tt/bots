import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ColorResolvable, MessageComponentInteraction, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { getActionRowsFromComponents, generateBlankEmbed } from "./utilities/Util";
import { PostgresReminder } from "./utilities/PostgresReminder";
import { CommandType } from "./utilities/Types";

export default {
    data: new SlashCommandBuilder()
    .setName('createreminder')
    .setDescription("Create a reminder."),
    
    /**
     * @inheritDoc
     */
    async execute(interaction: ChatInputCommandInteraction) {
        // get user input
        const reminderMsg = interaction.options.getString("reminder_info");
        // unique ID for the message so interactions don't collide
        const uniqueId = `${Date.now()}_${interaction.user.id}_${Math.random()}`;

        // creates embed with the user's message
        const remindEmbed = generateBlankEmbed(interaction.user, "Green")
            .setTitle("Reminder information")
            .setFooter({
                text: `Server Context: ${interaction.guild?.name ?? "Direct Message @edbird"}`,
            })
            .setDescription("Hello! You'd like to be reminded about: " + `${reminderMsg}`);

        // after user sends slash command, reply with embed and button 
        await interaction.reply({
            embeds: [remindEmbed],
            components: getActionRowsFromComponents([
                new ButtonBuilder()
                    .setLabel("Set Date")
                    .setCustomId(`${uniqueId}_date`)
                    .setStyle(ButtonStyle.Primary)
            ]), 
        });

        // checks for [duration] if there's any button presses
        // if no interaction within [duration], just exit
        while (true) {
            let interact: MessageComponentInteraction | null = null;
            try {
                interact = await interaction.channel!.awaitMessageComponent({
                    filter: (i) =>
                        i.user.id === interaction.user.id &&
                        i.customId.startsWith(uniqueId),
                    time:  2 * 60 * 1000,
                    // clear interactions after completion
                    dispose: true
                });
            }
            catch (e) {
                // Ignore the error; this is because the collector timed out.
            }

            // if there's no button press within [duration], delete it
            if (!interact) {
                break;
            }

            if (interact.isButton()) {
                if (interact.customId === `${uniqueId}_date`) {
                        const inputs = [
                            new TextInputBuilder()
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(2)
                                .setLabel("Month (1-12)")
                                .setCustomId("month")
                                .setRequired(true),
                            new TextInputBuilder()
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(2)
                                .setLabel("Day (1-31)")
                                .setCustomId("day")
                                .setRequired(true),
                            new TextInputBuilder()
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(4)
                                .setLabel("Year (xxxx)")
                                .setCustomId("year")
                                .setRequired(true),
                            new TextInputBuilder()
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(2)
                                .setLabel("Hour (1-24)")
                                .setCustomId("hour")
                                .setRequired(true),
                            new TextInputBuilder()
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(2)
                                .setLabel("Minute (1-60)")
                                .setCustomId("minute")
                                .setRequired(true),
                        ]

                        const ALL_CHARACTERS: string[] = [
                            ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
                            ..."abcdefghijklmnopqrstuvwxyz".split(""),
                            ..."0123456789".split("")
                        ];

                        let modalCustomdId = "";
                        // Create a 30 char long random ID for the interaction
                        for (let i = 0; i < 30; ++i) {
                            modalCustomdId += ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)];
                        }               

                        modalCustomdId += Date.now();
                
                        const modal = new ModalBuilder()
                            .setTitle("Set Date (24 Hour Time")
                            .setCustomId(modalCustomdId);
                
                        for (const input of inputs) {
                            modal.addComponents(
                                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                                    .addComponents(input)
                            );
                        }
                
                        const modalSubmission = await interact.showModal(modal).then(() => interact!.awaitModalSubmit({
                            filter: i => i.customId === modalCustomdId,
                            time: 60 * 1000
                        }));

                        try {
                            const month = Number.parseInt(modalSubmission.fields.getTextInputValue("month"));
                            const day = Number.parseInt(modalSubmission.fields.getTextInputValue("day"));
                            const year = Number.parseInt(modalSubmission.fields.getTextInputValue("year"));
                            const hour = Number.parseInt(modalSubmission.fields.getTextInputValue("hour"));
                            const minute = Number.parseInt(modalSubmission.fields.getTextInputValue("minute"));

                            await modalSubmission.deferUpdate();
                            const date = new Date();
                            date.setMonth(month - 1);
                            date.setDate(day);
                            date.setFullYear(year);
                            date.setHours(hour);
                            date.setMinutes(minute);

                            let message;
                            let color: ColorResolvable = "Green";
                            if (!Number.isNaN(date.getTime())) {
                                if (date < new Date()){
                                    message = "Sorry, we can't remind you in the past!";
                                    color = "Red";
                                }
                                else {
                                    // save the info into the db 
                                    PostgresReminder.insert(interaction.user.id, reminderMsg, date, interaction.channel!.id);
                                    // get time in seconds and display as relative discord time to user
                                    message = "Date set! " + `${`<t:${Math.trunc(date.getTime() / 1000)}:R>`}, `+ "you'll be reminded about: " + reminderMsg;
                                    color = "Green";
                                } 
                            }
                            else {
                                message = "Date not recognized! Try again.";
                                color = "Red";
                            }

                            // change the old embed to contain information about their reminder
                            const newEmbed = generateBlankEmbed(interaction.user, color)
                                .setTitle("Result")
                                .setFooter({
                                    text: `Server Context: ${interaction.guild?.name ?? "Direct Message @edbird"}`, })
                                .setDescription(message);
                            
                            await interaction.editReply({ 
                                embeds: [newEmbed],
                                components: []
                            });
                        } catch (e) {
                            // ignore timeout error here
                        }
                }
            }
        }
    }
} as CommandType