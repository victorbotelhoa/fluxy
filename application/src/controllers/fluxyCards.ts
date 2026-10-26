import fs from "fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    ContainerBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    AttachmentBuilder
} from "discord.js";
import { DataManage, ObjectType } from "../index.js";
import { Card } from "../types/cardBody.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CardsDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "storage",
    "cards"
);

export class FluxyCards {

    private static async _resolveImgPath(filepath: string) {
        const resolved = path.resolve(__dirname, filepath);

        try {
            await fs.access(resolved);
        } catch (err) {
            throw new Error(
                [
                    "O caminho especificado não existe ou é inválido.",
                    `Recebido: ${filepath}`,
                    `Resolvido: ${resolved}`,
                    `cwd: ${process.cwd()}`,
                    `Erro: ${err instanceof Error ? err.message : err}`
                ].join("\n")
            );
        }

        if (
            !filepath.endsWith(".png") &&
            !filepath.endsWith(".jpg") &&
            !filepath.endsWith(".webp") &&
            !filepath.endsWith(".gif")
        ) {
            throw new Error(
                `[Segurança] - Extensão inválida: ${filepath}`
            );
        }

        return resolved;
    }


    public static async fetchCards(): Promise<Card[]> {
        const dir = await fs.opendir(CardsDir);

        const filesPath: string[] = [];
        const cards: Card[] = [];

        for await (const dirent of dir) {
            if (!dirent.isFile()) continue;
            if (!dirent.name.endsWith(".json")) continue;

            filesPath.push(
                path.join(CardsDir, dirent.name)
            );
        }

        for (const file of filesPath) {
            const content = JSON.parse(
                await fs.readFile(file, "utf8")
            );

            cards.push(content);
        }

        return cards;
    }


    public static async dailyRoll(
        interaction: ChatInputCommandInteraction
    ) {

        const maxRolls = 2;

        const cards = await this.fetchCards();


        // Cria usuário automaticamente caso não exista
        const userData = await DataManage.fetchUser(
            interaction.user.id,
            interaction.user.username
        );


        if (!userData) {
            console.error(
                new Error(
                    "Não foi possível criar o usuário."
                )
            );

            return;
        }


        userData.timestamps ??= {
            ccards: {
                rolls: 0
            }
        };


        const user_timestamps =
            userData.timestamps.ccards;


        if (user_timestamps.rolls >= maxRolls) {
            await interaction.reply(
                "Você já girou cards demais hoje. Volte amanhã."
            );

            return;
        }


        const roll = Math.floor(
            Math.random() * cards.length
        );

        const card = cards[roll];


        if (typeof card.img_path !== "string") {
            throw new Error(
                `Caminho de imagem não fornecido no card ${card.id}`
            );
        }


        const imagePath = await this._resolveImgPath(
            card.img_path
        );


        const img_file = new AttachmentBuilder(
            imagePath,
            {
                name: "card.png"
            }
        );


        const container = new ContainerBuilder()
            .setAccentColor(0x6400ff)

            .addTextDisplayComponents(t =>
                t.setContent(
                    `# ${card.name}\n**${card.description}**`
                )
            )

            .addTextDisplayComponents(t =>
                t.setContent(
                    `Raridade: **${card.rarity}**`
                )
            )

            .addMediaGalleryComponents(m =>
                m.addItems(i =>
                    i
                        .setDescription("CardIMG")
                        .setURL(
                            "attachment://card.png"
                        )
                )
            )

            .addSeparatorComponents(
                separator => separator
            );



        const hasCard = userData.cards.some(
            c => c.name === card.name
        );


        if (hasCard) {

            container.addSectionComponents(c =>
                c
                    .addTextDisplayComponents(t =>
                        t.setContent(
                            "Carta Repetida"
                        )
                    )

                    .setButtonAccessory(b =>
                        b
                            .setCustomId(
                                `${card.id}_chances`
                            )
                            .setLabel(
                                "Ver Chances"
                            )
                            .setStyle(
                                ButtonStyle.Success
                            )
                    )
            );


            await interaction.reply({
                components: [container],
                flags: "IsComponentsV2",
                files: [img_file]
            });

            return;
        }



        container.addSectionComponents(c =>
            c
                .addTextDisplayComponents(t =>
                    t.setContent(
                        "Opções"
                    )
                )

                .setButtonAccessory(b =>
                    b
                        .setCustomId(
                            `${card.id}_skills`
                        )
                        .setLabel(
                            "Habilidades"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        )
                )
        );



        await DataManage.give(
            interaction.user.id,
            ObjectType.C_ROLLS,
            1
        );


        await DataManage.give(
            interaction.user.id,
            ObjectType.CARDS,
            card.name
        );



        await interaction.reply({
            components: [container],
            flags: "IsComponentsV2",
            files: [img_file]
        });
    }
}