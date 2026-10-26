import { EmbedBuilder, Events } from "discord.js";

export default {
    data: Events.MessageCreate,
    async execute(message) {
        console.log(message)
        if (message.content.startsWith(".expecto")) {
            const embed = new EmbedBuilder()
                .setTitle("PATRONUM!🔦")
                .setImage("https://tenor.com/view/harry-potter-wizard-gif-12956091");
    
            message.reply({embeds: [embed]})
        }
    }
}