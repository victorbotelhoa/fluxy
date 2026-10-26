import { SlashCommandBuilder } from 'discord.js';
import { FluxyCards } from '../../dist/index.js'

export default {
    data: new SlashCommandBuilder() 
        .setName("cards")
        .setDescription("Cartas")
        .addSubcommand(sub => 
            sub.setName("girar").setDescription("Gire até 2 cards por dia!")
        ),
        async execute(interaction) {
            await FluxyCards.dailyRoll(interaction)
        }
}