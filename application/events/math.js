'strict mode';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import FLM from "../src/utils/MathQuests.js";
const operations = new Map()
export default {
    data: Events.InteractionCreate,
    async execute(i) {
        
        if (i.isButton()) {

            const modal = new ModalBuilder()
                .setCustomId("math_response_modal")
                .setTitle("Responder questão");

            const input = new TextInputBuilder()
                .setCustomId("math_response_input")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addLabelComponents({
                "label": "Insira sua resposta",
                "component": input
            })

            if (i.customId === 'starts_math') {
                operations.set(i.user.id, await FLM.operationCreate(FLM.QuestsTypes.Addition, 2))
                
                const embed = new EmbedBuilder()
                    .setTitle("Questão Fluxymática")
                    .setDescription(String(operations.get(i.user.id).operation))
                    .setColor("Blue");

                const button = new ButtonBuilder()
                    .setLabel("Responder")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("math_showmodal");

                const row = new ActionRowBuilder();
                row.addComponents(button);
                await i.reply({components: [row], embeds: [embed]})
            }

            if (i.customId === "math_showmodal") {
                await i.showModal(modal)
            }

        } else if (i.isModalSubmit()) {
            if (i.customId === "math_response_modal") {
                const response = i.fields.getTextInputValue("math_response_input")
                const operation = operations.get(i.user.id);
                if (Number(response) === operation.result) {
                    i.reply({content: "VOCÊ GANHOU"})
                } else {
                    i.reply({content: "nossa, errou."})
                }
            }
        }
       
    }
}