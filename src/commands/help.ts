import { AbstractCommand } from "./abstractCommand";
import { MessageInfo } from "../lib/types";
const helpMsg = `Here is the list of available commands
\`help\` - prints this help message
`
const command = 'help'
export class HelpCommand extends AbstractCommand{
    constructor() {
        super(command)
    }
    async action(cmd: string, msgInfo:MessageInfo, params:string[]) {
        console.log(`- HelpCommand: 'Hello <@${msgInfo.user}>'`)
        await this.reply(msgInfo, `Hello <@${msgInfo.user}>. ` + helpMsg)
    }
}