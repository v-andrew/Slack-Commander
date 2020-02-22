import { MessageInfo } from './../lib/types';
 import { AbstractCommand } from "./abstractCommand";
 import { filter } from 'rxjs/operators';
 const defaultMsg = `is not in a list of recognized commands.
 You can use \`help\` to see list of available commands and parameters`
 const command = 'default'
 export class DefaultCommand extends AbstractCommand{
     constructor() {
         super(command, false)
     }
     filter = filter(cmd => !AbstractCommand.registeredCommands.includes(cmd[0].toLowerCase()))
     async action(cmd: string, msgInfo:MessageInfo, params:string[]) {
         console.log(`- DefaultCommand: <@${msgInfo.user}>`)
         await this.reply(msgInfo, `Hello <@${msgInfo.user}>.\n"${cmd}" ` + defaultMsg)
         if (cmd === 'DEBUG') {
             process.env.DEBUG = params[0]
             console.log(`- - DEBUG set to "${params[0]}"`)
         }
     }
 }