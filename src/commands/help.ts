import { AbstractCommand } from "./abstractCommand";
import { MessageInfo } from "../lib/types";
import { CommandsRegistry } from "./commandsRegistry";

const helpMsg = `Here is the list of available commands
`
const command = 'help'
export class HelpCommand extends AbstractCommand{
    helpAndUsage = {usage:'`help` - prints this help message', command: command}
    constructor() {
        super(command)
    }
    helpMessage: string = null
    async action(cmd: string, msgInfo:MessageInfo, params:string[]) {
        console.log(`- HelpCommand: 'Hello <@${msgInfo.user}>'`)
        if (!this.helpMessage) {
            this.helpMessage = helpMsg + CommandsRegistry.filter(c=>c.helpAndUsage.command && c.helpAndUsage.command != 'abstract').map(c=>c.helpAndUsage.usage).join('\n')
        }
        await this.reply(msgInfo, `Hello <@${msgInfo.user}>. ` + this.helpMessage)
    }
}