import { EmbedBuilder, Events } from "discord.js";

export default {
    data: Events.MessageCreate,

    async execute(message) {
        if (message.author.bot) return;

        if (message.content.startsWith(".org")) {

            await message.delete().catch(() => {});

            const fileName = "disfox.png";

            const embed = new EmbedBuilder()
                .setTitle("🚀 Seja como a Fluxy!")
                .setDescription(`
# 🚀 Conheça o Disfox

Quer desenvolver aplicações para Discord com mais organização, produtividade e menos dor de cabeça?

**Disfox** é um framework para **Node.js** projetado para potencializar o desenvolvimento com **discord.js**, oferecendo uma estrutura moderna, organizada e escalável para seus projetos.

## ⚡ O que o Disfox oferece?

• Ferramentas de automação para acelerar o desenvolvimento  
• Utilitários prontos para tarefas comuns  
• Um modelo estrutural pensado para aplicações Discord  
• Organização clara de comandos, eventos e serviços  
• Uma base preparada para projetos simples e complexos  
• Integração simplificada com discord.js  
• Arquitetura focada em produtividade e manutenção

## 📚 Documentação

Tudo o que você precisa pra começar está na docs oficial.

🔗 https://disfox.js.org

## 💬 Comunidade

Suporte, dúvidas e novidades do projeto:

🔗 https://discord.gg/UuZnAuhhP6

## 🌎 Links Úteis

• Site Oficial: https://disfox.js.org  
• NPM: https://www.npmjs.com/package/disfox  
• GitHub: https://github.com/DisfoxJS/Disfox  
• Discord: https://discord.gg/UuZnAuhhP6  
• Legacy: https://disfox.netlify.app  
`)
                .setImage(`attachment://${fileName}`)
                .setColor(0x669ffa)
                .setTimestamp()
                .setFooter({
                    text: "© 2026 FluxoArts",
                    iconURL: "attachment://fl-icon.png"
                });

            await message.channel.send({
                content: "-# ||@everyone @here||",
                embeds: [embed],
                files: [
                    {
                        attachment: "./assets/disfox.png",
                        name: fileName
                    },
                    {
                        attachment: "./assets/fl-icon.png",
                        name: "fl-icon.png"
                    }
                ]
            });
        }
    },
};