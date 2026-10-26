import {
    AttachmentBuilder,
    EmbedBuilder
} from "discord.js";
import {
    SlashOptions,
    SlashService
} from "disfox";
import canvas from "canvas";
import sharp from "sharp";

import { fileURLToPath } from "node:url";

const shipBackground = fileURLToPath(
    new URL("../../../assets/ship.png", import.meta.url)
);

const usuario1Option = new SlashService.Option("usuario1")
    .type(SlashOptions.Mentionable)
    .required(true)
    .description("Selecione o primeiro usuário a shippar.");

const usuario2Option = new SlashService.Option("usuario2")
    .type(SlashOptions.Mentionable)
    .required(true)
    .description("Selecione o segundo usuário a shippar.");

const c = new SlashService.Command("ship")
    .description("💗 Teste o amor dos usuários!")
    .option(usuario1Option)
    .option(usuario2Option)
    .action(async (interaction) => {
        await interaction.deferReply();

        const usuario1 = interaction.options.getUser("usuario1");
        const usuario2 = interaction.options.getUser("usuario2");

        if (!usuario1 || !usuario2) {
            return interaction.editReply(
                "Você precisa selecionar dois usuários válidos."
            );
        }

        const percentage = Math.floor(Math.random() * 51) + 50;

        const loveImage = canvas.createCanvas(1920, 461);
        const ctx = loveImage.getContext("2d");

        const backgroundImage = await canvas.loadImage(shipBackground);
        ctx.drawImage(backgroundImage, 0, 0, loveImage.width, loveImage.height);

        const avatar1URL = usuario1.displayAvatarURL({
            extension: "png",
            size: 512
        });

        const avatar2URL = usuario2.displayAvatarURL({
            extension: "png",
            size: 512
        });

        const avatarSize = 400;
        const centerY = (loveImage.height - avatarSize) / 2;
        const avatar1X = loveImage.width / 2 - avatarSize - 350;
        const avatar2X = loveImage.width / 2 + 350;

        try {
            const avatar1Buffer = Buffer.from(
                await (await fetch(avatar1URL)).arrayBuffer()
            );

            const avatar1Image = await canvas.loadImage(
                await sharp(avatar1Buffer).png().toBuffer()
            );

            ctx.save();
            ctx.beginPath();
            ctx.arc(
                avatar1X + avatarSize / 2,
                centerY + avatarSize / 2,
                avatarSize / 2,
                0,
                Math.PI * 2
            );
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(
                avatar1Image,
                avatar1X,
                centerY,
                avatarSize,
                avatarSize
            );
            ctx.restore();

            const avatar2Buffer = Buffer.from(
                await (await fetch(avatar2URL)).arrayBuffer()
            );

            const avatar2Image = await canvas.loadImage(
                await sharp(avatar2Buffer).png().toBuffer()
            );

            ctx.save();
            ctx.beginPath();
            ctx.arc(
                avatar2X + avatarSize / 2,
                centerY + avatarSize / 2,
                avatarSize / 2,
                0,
                Math.PI * 2
            );
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(
                avatar2Image,
                avatar2X,
                centerY,
                avatarSize,
                avatarSize
            );
            ctx.restore();
        } catch (error) {
            console.error("Erro ao carregar os avatares:", error);

            return interaction.editReply({
                content: "Houve um erro ao carregar os avatares. Tente novamente mais tarde."
            });
        }

        ctx.fillStyle = "white";

        ctx.font = "80px sans-serif";
        const percentText = `${percentage}%`;
        ctx.fillText(
            percentText,
            (loveImage.width - ctx.measureText(percentText).width) / 2,
            250
        );

        ctx.font = "60px sans-serif";
        const compatText = `${percentage}% Compatibilidade!`;
        ctx.fillText(
            compatText,
            (loveImage.width - ctx.measureText(compatText).width) / 2,
            440
        );

        const attachment = new AttachmentBuilder(loveImage.toBuffer(), {
            name: "ship.jpg"
        });

        const embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setImage("attachment://ship.jpg");

        let mensagemFinal;

        if (percentage >= 90) {
            mensagemFinal = `💘 <@${usuario1.id}> tem **${percentage}%** de chance com <@${usuario2.id}>. **Uau! Temos um novo casal por aqui! 💗**`;
        } else if (percentage > 20) {
            mensagemFinal = `💘 <@${usuario1.id}> tem **${percentage}%** de chance com <@${usuario2.id}>. Dão um belo ship, hein!`;
        } else {
            mensagemFinal = `🫠 <@${usuario1.id}> tem só **${percentage}%** de chance com <@${usuario2.id}>. Acho que não vai rolar...`;
        }

        await interaction.editReply({
            content: mensagemFinal,
            embeds: [embed],
            files: [attachment]
        });
    });

export default c;