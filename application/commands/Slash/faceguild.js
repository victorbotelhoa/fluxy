import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashService } from "disfox";

const c = new SlashService.Command('faceguild')
    .description("Envia o ícone do servidor atual.")
    .action(async interaction => {
        const messages = [
            " Este é o símbolo visual que representa este servidor no Discord.",
            "A imagem que dá cara a esta comunidade.",
            "O ícone oficial deste servidor digital.",
            "A identidade visual desse servidor.",
            "O rosto deste espaço virtual.",
            "O emblema que representa esta comunidade.",
            "Aqui está o ícone que define este servidor entre os demais.",
            "O rosto deste servidor entre os milhões do Discord.",
            "Um emblema que diz tudo sem dizer uma palavra.",
        ];
           const randomMessage = messages[Math.floor(Math.random() * messages.length)];

            const guild = interaction.guild;
            const iconURL = guild.iconURL({ dynamic: true, size: 512 });
            const guildName = interaction.guild.name

            const embed = new EmbedBuilder()
                .setImage(iconURL)
                .setFooter({ text: `😎 ${randomMessage}` });
            await interaction.reply({ embeds: [embed], content: `Este é o ícone de **${guild.name}**!`});
})

export default c;
