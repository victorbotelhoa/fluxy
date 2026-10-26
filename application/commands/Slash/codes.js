import { SlashOptions, SlashService } from "disfox";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { DataManage, ObjectType } from "../../dist/controllers/dataManage.js";

const codesPath = fileURLToPath(
    new URL("../../../storage/codes.json", import.meta.url)
);

const codigoOption = new SlashService.Option("codigo")
    .type(SlashOptions.String)
    .description("Insira o código para resgatar sua recompensa.")
    .required(true);


const c = new SlashService.Command("resgatar-codigo")
    .description("Resgate um código ativo e ganhe recompensas!")
    .option(codigoOption)

    .action(async interaction => {

        try {

            const insertedCode =
                interaction.options.getString("codigo");


            const user = await DataManage.fetchUser(
                interaction.user.id,
                interaction.user.username
            );


            if (!user) {
                return interaction.reply(
                    "❌ Não foi possível criar sua carteira."
                );
            }


            const codesData = JSON.parse(
                await readFile(codesPath, "utf8")
            );


            const code = codesData.find(
                c => c.codeID === insertedCode
            );


            if (!code) {
                return interaction.reply(
                    `❌ Código **${insertedCode}** não encontrado.`
                );
            }


            if (!code.active) {
                return interaction.reply(
                    `😿 Código **${insertedCode}** expirado.`
                );
            }


            if (user.usedCodes.includes(insertedCode)) {
                return interaction.reply(
                    "❌ Você já resgatou esse código."
                );
            }



            switch (code.type) {

                case "Cash":

                    await DataManage.give(
                        interaction.user.id,
                        ObjectType.BREEZE,
                        code.value
                    );

                    break;


                case "Crystal":

                    await DataManage.give(
                        interaction.user.id,
                        ObjectType.CRYSTAL,
                        code.value
                    );

                    break;


                case "Card":

                    await DataManage.give(
                        interaction.user.id,
                        ObjectType.CARDS,
                        code.value
                    );

                    break;


                case "LevelPoints":

                    await DataManage.update(
                        interaction.user.id,
                        user => {
                            user.levelPoints += code.value;
                        }
                    );

                    break;
            }


            await DataManage.update(
                interaction.user.id,
                user => {
                    user.usedCodes.push(insertedCode);
                }
            );


            await interaction.reply(
                `✅ Código resgatado com sucesso! Você recebeu **${code.value} ${code.type}**.`
            );


        } catch (error) {

            console.error(
                "Erro no resgatar-codigo:",
                error
            );


            if (!interaction.replied) {
                await interaction.reply(
                    "❌ Erro ao executar comando."
                );
            }
        }
    });


export default c;