import { EmbedBuilder } from "discord.js";
import { SlashService } from "disfox";
import { readFile } from "node:fs/promises";

const c = new SlashService.Command("vista")
    .description("Aprecie uma linda vista de um estado de cada país!")
    .action(async (interaction) => {
        const vistas = JSON.parse(
            await readFile(
                new URL("../../../storage/vistas.json", import.meta.url),
                "utf8"
            )
        );

        const vista = vistas[Math.floor(Math.random() * vistas.length)];

        const embed = new EmbedBuilder()
            .setImage(vista.url)
            .setColor("Random");

        await interaction.reply({
            content: "# **Aqui está uma bela vista para você! 🌟🕶️**",
            embeds: [embed]
        });
    });

export default c;