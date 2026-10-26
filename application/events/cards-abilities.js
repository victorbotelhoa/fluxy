import { Events } from "discord.js";

export default {
    data: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const id = interaction.customId;

        if (!(id.endsWith('_skills') || id.endsWith('_chances'))) return;
        if (interaction.replied) return;

        interaction.reply({
            content: "Essa funcionalidade está sendo **✨Construída✨**! Embreve, iremos anunciar uma nova versão da Fluxy em nossos canais de anúncios.",
            flags: 64
        })
    }
}