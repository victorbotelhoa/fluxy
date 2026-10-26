import chalk from "chalk"
import { SlashService } from "disfox";

const msg = chalk.hex('#3700ff')('[Fluxy] |')

export default async function slashMain(slashDir, appInstance) {
    const commands = (await SlashService.extractDir(slashDir)).valid
    console.log(msg, chalk.hex('#0091ff')("Deploying (/) commands..."));
    await appInstance.slash.deployGuilds(commands, ["1301562725247488040"])
    await appInstance.slash.listen({onError: {
        callback: (interaction, error) => {
            console.error(msg, chalk.hex('#ff4133')("Error to execute Command: "), error)
            if (!interaction.replied) {
                interaction.reply({content: "Ocorreu um erro ao executar este comando, e já estamos diagnosticando o erro! tente novamente mais tarde.", flags: 64})
            }
        }
    }})

    console.log(msg, chalk.hex('#00ff15')("(/) Commands registered successfully. "));
}