import {
    Events,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js";

const comandosPadrao = `
**Comandos Slash:**
- ** /help**  - Pequeno guia zVoldemort.
- ** /ping**  - Verifica o ping do bot
- ** /afk** - Marca como AFK
- ** /card**  - Gira um card por dia [JOGO]
- ** /lucky**  - Mostra sua sorte do dia
- ** /ship**  - Faz um ship entre 2 usuários.
- ** /luta**  - Faz uma luta entre 2 usuários.
- ** /vista**  - Fornece uma vista do Brasil.
- ** /guildbanner**  - Fornece o banner do servidor atual.
- ** /faceguild**  - Fornece o ícone do servidor atual.
- ** /perfil-servidor**  - Envia o perfil do servidor.
- ** /perfil**  - Envia o perfil de um usuário selecionado.

**Comandos Prefixo:**
- ** .help** - Oferece um pequeno guia de comandos do Fluxy
- ** .card** - Gira cards sem funções.
- ** .perfil** - Mostra o seu perfil.
- ** .perfil @user** - Mostra o perfil do usuário mencionado.
- ** .guildbanner** - Fornece o banner do servidor atual.
- ** .faceguild** - Fornece o ícone do servidor atual.
- ** .server** - Envia o perfil do servidor.
`;

export default {
    data: Events.MessageCreate,

    async execute(message) {
        if (message.author.bot) return;

        if (
            message.content.toLowerCase() === ".help" ||
            message.content.toLowerCase() === ".ajuda"
        ) {
            const author = message.author;

            const embedPadrao = new EmbedBuilder()
                .setTitle("Painel de Ajuda | Fluxy")
                .setDescription(
                    "🪄 Precisou de ajuda? Uma coruja chegou com a resposta! 📜\n\n" +
                    "Eu sou a Fluxy! Eu posso te ajudar no dia a dia ou entreter você com meus melhores jogos! 😊\n\n" +
                    'Experimente explorar meus comandos em **"Todos os Comandos"**! (Todas as funcionalidades, incluindo este painel, estão em beta. Algumas coisas podem não funcionar ou estar quebradas.)'
                )
                .setImage("https://cdn.discordapp.com/attachments/1314820419316093008/1379547103147200682/fluxyamam.png")
                .setColor("Purple");

            const row = new ActionRowBuilder().addComponents(
                

                new ButtonBuilder()
                    .setLabel("Ir para o Site")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://fluxybot.netlify.app")
            );

            await message.reply(
                "<:Check:1352817249932546161> Lista de comandos enviada em sua DM!"
            );

            await author.send({
                embeds: [embedPadrao],
                components: [row]
            });
        }
    }
};