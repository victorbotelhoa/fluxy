import chalk from "chalk"
import { EventService } from "disfox";

const msg = chalk.hex('#3700ff')('[Fluxy] |')

export default async function eventsMain(eventsDir, appInstance) {
    console.log(msg, chalk.hex('#0091ff')("Deploying events..."));
    const events = (await EventService.extractDir(eventsDir))
    if (events.invalid?.length) console.warn(msg, " Some events have an invalid structure and were ignored. ", events);
    
    await appInstance.events.listenEvents(events.valid)
    console.log(msg, chalk.hex('#00ff37')("Listening events"));
}
