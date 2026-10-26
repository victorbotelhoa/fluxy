import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const afkpath = path.join(__dirname, '..', '..', '..', 'Storage', 'afk.json')



export default {
    data: new SlashCommandBuilder()
        .setName('modo')
        .setDescription('tabela de modos')
        .addSubcommand(sub => {
            return sub.setName('afk').setDescription('Ativa/Desativa o modo afk')
        }),
        async execute(i) {
            const raw = JSON.parse(fs.readFileSync(afkpath, 'utf8'))
            const user = raw.find(u => u.id === i.user.id)
            if (!user) {

                const newdata = {
                    id: i.user.id,
                    isAfk: false,
                    content: ''
                }

                raw.push(newdata)

                fs.writeFileSync(afkpath, JSON.stringify(raw, null, 4))
            }

            const embed = new EmbedBuilder()
                .setTitle('<a:Status1:1352102908598157466> Marcar notificações AFK')
                .setColor('#570fff')
                .setDescription(
                    'Diga aos outros que você está **ocupado** no momento!\n' +
                    'Para **ativar** o modo AFK, clique no botão `Ativar` e depois insira o motivo da sua indisponibilidade.\n' +
                    'Para desativar, clique em `Desativar`.'
                );
                
        
            const row = new ActionRowBuilder()

            if (!user.isAfk) {
                 row.addComponents(
                    new ButtonBuilder()
                        .setLabel('Ligar')
                        .setStyle(ButtonStyle.Success)
                        .setCustomId('afkOn'),
                 )
            } else {
                row.addComponents(
                    new ButtonBuilder()
                        .setLabel('Desligar')
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId('afkOff'),
                    new ButtonBuilder()
                        .setLabel('Trocar Mensagem')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('afkRe')
                )
            }
            await i.reply({embeds: [embed], components: [row], flags: 64})
        }
        
}