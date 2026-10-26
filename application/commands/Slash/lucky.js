import {
  EmbedBuilder,
  AttachmentBuilder
} from 'discord.js'

import canvas from 'canvas'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { SlashService } from 'disfox'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cooldown de 24h por usuário
const lastUsedTimes = new Map()

const imageCaminho = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'assets',
  'luckyBackground.png'
)

// Gera uma porcentagem entre 1 e 100
function gerarPorcentagem() {
  return Math.floor(Math.random() * 100) + 1
}

// Retorna cor e mensagem baseadas na porcentagem
function resolverResultado(percentage, embed) {
  let mensagem

  if (percentage === 100) {
    embed.setColor('#FFD700')
    mensagem = `**👑 Hoje, você terá um dia PERFEITO! Com 🏆 ${percentage}%, sua sorte está no auge.**`
  } else if (percentage >= 90) {
    embed.setColor('#00FF99')
    mensagem = `🌟 **Com ${percentage}%, você terá um dos melhores dias da sua vida!**`
  } else if (percentage >= 70) {
    embed.setColor('#46cb07')
    mensagem = `🍀 Sua **sorte do dia é positiva!** Com **${percentage}%**, seu dia promete ser bom.`
  } else if (percentage >= 50) {
    embed.setColor('#FFA500')
    mensagem = `😐 Com **${percentage}%**, seu dia será mediano. Nada de extraordinário, mas também nada de ruim.`
  } else if (percentage >= 30) {
    embed.setColor('#FF6347')
    mensagem = `⚠️ Com **${percentage}%**, tome cuidado hoje. As coisas podem não sair como planejado.`
  } else {
    embed.setColor('#FF0000')
    mensagem = `☠️ Hoje parece que a **sorte não está do seu lado**... Com apenas **${percentage}%**, é melhor se preparar para imprevistos!`
  }

  return mensagem
}

// Desenha o avatar circular no canvas
async function desenharAvatar(ctx, author, canvasHeight) {
  const avatarURL = author.displayAvatarURL({ forceStatic: true, size: 512, extension: 'png' })

  const avatarResponse = await fetch(avatarURL)
  const avatarBuffer = Buffer.from(await avatarResponse.arrayBuffer())
  const avatarConverted = await sharp(avatarBuffer).png().toBuffer()
  const avatarImage = await canvas.loadImage(avatarConverted)

  const size = 300
  const avatarX = 100
  const avatarY = (canvasHeight / 2) - (size / 2)

  ctx.save()
  ctx.beginPath()
  ctx.arc(avatarX + size / 2, avatarY + size / 2, size / 2, 0, Math.PI * 2, false)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatarImage, avatarX, avatarY, size, size)
  ctx.restore()
}

// Desenha os textos no canvas
function desenharTextos(ctx, canvasWidth, canvasHeight, percentage) {
  ctx.fillStyle = 'white'
  ctx.font = '80px sans-serif'

  const labelTxt = 'Sorte do Dia:'
  const percentageTxt = `${percentage}%`

  const labelX = 430
  const textY = canvasHeight / 2 + 25

  ctx.fillText(labelTxt, labelX, textY)

  const percentageWidth = ctx.measureText(percentageTxt).width
  const percentageX = canvasWidth - percentageWidth - 580

  ctx.fillText(percentageTxt, percentageX, textY)
}

const command = new SlashService.Command('sorte')
  .description('🍀 Mostra sua Sorte do Dia!')
  .action(async (interaction) => {
    const userId = interaction.user.id
    const agora = Date.now()
    const cooldown = 24 * 60 * 60 * 1000

    // Checa cooldown
    if (lastUsedTimes.has(userId) && agora - lastUsedTimes.get(userId) < cooldown) {
      const tempoRestante = cooldown - (agora - lastUsedTimes.get(userId))
      const horas = Math.floor(tempoRestante / (1000 * 60 * 60))
      const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60))
      return await interaction.reply({
        content: `⛔ Você já viu sua sorte hoje! Volte em **${horas}h ${minutos}min**.`,
        ephemeral: true
      })
    }

    await interaction.deferReply()

    const percentage = gerarPorcentagem()

    // Carrega e monta o canvas
    let imageBuffer
    try {
      const backgroundImage = await canvas.loadImage(imageCaminho)
      const abyssCanvas = canvas.createCanvas(backgroundImage.width, backgroundImage.height)
      const ctx = abyssCanvas.getContext('2d')

      ctx.drawImage(backgroundImage, 0, 0)

      await desenharAvatar(ctx, interaction.user, abyssCanvas.height)
      desenharTextos(ctx, abyssCanvas.width, abyssCanvas.height, percentage)

      imageBuffer = abyssCanvas.toBuffer()
    } catch (error) {
      console.error('Erro ao gerar imagem:', error)
      return interaction.editReply({ content: '❌ Erro ao gerar a imagem. Tente novamente mais tarde.' })
    }

    // Monta embed e mensagem
    const embed = new EmbedBuilder()
      .setTitle('🔮 Sorte do Dia')
      .setImage('attachment://sorte.png')

    const mensagem = resolverResultado(percentage, embed)
    const attachment = new AttachmentBuilder(imageBuffer, { name: 'sorte.png' })

    // Registra uso DEPOIS de tudo que pode falhar
    lastUsedTimes.set(userId, agora)

    await interaction.editReply({
      content: mensagem,
      embeds: [embed],
      files: [attachment]
    })

    // Log em canal dedicado (opcional — define LOG_CHANNEL_ID no seu .env)
    const logChannelId = process.env.LOG_CHANNEL_ID
    if (logChannelId) {
      const logChannel = interaction.guild?.channels.cache.get(logChannelId)
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('📊 Estatísticas de Comando')
          .setDescription(`O usuário **${interaction.user.tag}** usou o comando **/sorte** e tirou **${percentage}%**.`)
          .setColor('#00FF00')
          .setTimestamp()

        await logChannel.send({ embeds: [logEmbed] }).catch(console.error)
      }
    }
  })

export default command