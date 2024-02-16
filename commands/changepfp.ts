import { SlashCommandBuilder, } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { CommandType } from "..";

export default {
    data: new SlashCommandBuilder()
        .setName('setavatar')
        .setDescription('Sets the bot\'s avatar')
        .addAttachmentOption(o => o.setName('image')
            // whether the user must specify something for it
            .setRequired(true)
            // the description for the argument, shown to user when they 
            // start putting a value for the argument
            .setDescription('The image to set as the bot\'s avatar.')),
    async execute(interaction: ChatInputCommandInteraction) {
        // 'image' is the name I gave to the argument
        // true means this attachment is required so it will never be null
        // if it was false, then you would need to check if it was null first before
        // using it.
        const attachment = interaction.options.getAttachment('image', true);
        // if it's not an image, it won't have a height
        if (!attachment.height) 
                return;
        // url is the url to the image
        // do something with it
        await interaction.deferReply()
        console.log(attachment.url); 
        await interaction.client.user.setAvatar(attachment.url)
            //.then(user => (interaction.reply("profile set")));
        await interaction.editReply("profile set");
    },
} as CommandType;