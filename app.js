import "dotenv/config"
import chalk from "chalk";
import path from "path";
import fs from "fs"
import { 
    Client, 
    Events, 
    GatewayIntentBits, 
    ActivityType, 
    PresenceUpdateStatus
} from "discord.js";
import { AppConfig, Application } from "disfox";
import { fileURLToPath, pathToFileURL  } from "url";
//import { IC } from "./application/src/core/internalCommands.js"
import eventsMain from "./application/src/config/eventsMain.js";
import slashMain from "./application/src/config/slashMain.js";

const msg = chalk.hex('#3700ff')('[Fluxy] |')
const actStatus = '🇧🇷 Fluxy | .help'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const slashDir = path.join(__dirname, 'application', 'commands', 'Slash')
const eventsDir = path.join(__dirname, "application", "events")

async function init() {
    console.log("© 2026 FluxoArts")
    console.log(chalk.hex('#0091ff')('+ disfox@0.1.0'))

    const config = JSON.parse(fs.readFileSync("./config.json", "utf8"))

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildIntegrations,
        ]
    })

    

    const appConfig = new AppConfig();
    appConfig.set("ClientToken", config.fluxy.ClientToken);
    appConfig.set("Debug", config.fluxy.Debug);
    appConfig.set("RegisterDebugLogs", config.fluxy.RegisterDebugLogs);

    const fluxy = new Application({
        "client": client,
        "token": appConfig.get("ClientToken")
    })

    return { config, client, appConfig, fluxy };
}


const { client, appConfig, fluxy } = await init();

await fluxy.connect();

client.once(Events.ClientReady, async (readyClient) => {
    await eventsMain(eventsDir, fluxy)
    await slashMain(slashDir, fluxy)
    await import('./server.js')
    await fluxy.actions.setPresence(ActivityType.Custom, actStatus, PresenceUpdateStatus.Online)
    console.log(msg, chalk.hex('#0091ff')("Application online on", readyClient.user.tag));
    
})

export { appConfig, client, fluxy }



