import { SlashCommandBuilder, } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { CommandType } from "./utilities/Types";

export default {
    data: new SlashCommandBuilder()
        .setName('setavatar')
        .setDescription('Sets the bot\'s profile picture')
        .addAttachmentOption(o => o.setName('image')
            // whether the user has to attach an image
            .setRequired(true)
            .setDescription('The image to set as the bot\'s profile picture.')),
    
    /**
     * @inheritDoc
     */
    async execute(interaction: ChatInputCommandInteraction) {
        const attachment = interaction.options.getAttachment('image', true);
        
        // if it's not an image, it won't have a height
        if (!attachment.height) 
                return;
        // url is the url to the image
        // do something with it
        await interaction.deferReply()

        await interaction.client.user.setAvatar(attachment.url)
        await interaction.editReply("Profile set :)");
    },
} as CommandType;