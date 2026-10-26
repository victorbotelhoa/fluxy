import { EmbedBuilder } from "discord.js";
import { SlashService } from "disfox";
import { DataManage } from "../../dist/controllers/dataManage.js";

const c = new SlashService.Command("carteira")
    .description("Mostre sua carteira!")

    .action(async (interaction) => {

        const userEntry = await DataManage.fetchUser(
            interaction.user.id,
            interaction.user.username
        );


        if (!userEntry) {
            return interaction.reply({
                content: "❌ Não foi possível criar sua carteira.",
                ephemeral: true
            });
        }


        const userCash = userEntry.breezes > 0
            ? `${userEntry.breezes} Brisas`
            : "nem 1 brisa <:fluxyEmoji4:1391914874489278575>";


        const userCrystals = userEntry.crystals > 0
            ? `${userEntry.crystals} Cristais`
            : "total de 0 cristais";


        const userCards = userEntry.cards?.length > 0
            ? userEntry.cards
                .map(card => `- ${card.name}`)
                .join("\n")
            : "Nenhuma carta.";


        const userItems = userEntry.items?.length > 0
            ? userEntry.items
                .map(item => `- ${item.name}`)
                .join("\n")
            : "Nenhum item.";



        const embed = new EmbedBuilder()

            .setTitle(
                `Carteira de ${interaction.user.displayName}`
            )

            .setThumbnail(
                interaction.user.displayAvatarURL({
                    dynamic: true
                })
            )

            .setColor("Random")

            .addFields(

                {
                    name: "💨 Brisas",
                    value: userCash,
                    inline: true
                },

                {
                    name: "💎 Cristais",
                    value: userCrystals,
                    inline: true
                },

                {
                    name: "🃏 Cartas",
                    value: userCards,
                    inline: false
                },

                {
                    name: "🎁 Itens",
                    value: userItems,
                    inline: false
                },

                {
                    name: "⭐ Nível",
                    value: `${userEntry.level ?? 0}`,
                    inline: true
                },

                {
                    name: "📈 XP",
                    value: `${userEntry.levelPoints ?? 0}`,
                    inline: true
                }

            )

            .setFooter({
                text: "😉 Bela carteira!"
            });



        await interaction.reply({
            embeds: [embed]
        });

    });


export default c;