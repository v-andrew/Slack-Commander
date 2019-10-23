import { AbstractCommand } from "./abstractCommand";
import { Observable } from "rxjs";
import { Command } from "../lib/types";
import { filter } from 'rxjs/operators';

const helpMsg = `Here is the list of available commands
`
const command = 'help'
export class HelpCommand extends AbstractCommand{
    constructor() {
        super(command)
    }
    register(commands: Observable<Command>) {
        commands.pipe(
            filter(cmd => cmd[0].toLowerCase() === command)
        ).subscribe(
            ([cmd, msgInfo, params]) => {
                console.log(`- HelpCommand: 'Hello <@${msgInfo.user}>'`)
                this.reply(msgInfo, `Hello <@${msgInfo.user}>. ` + helpMsg)
            },
            err => console.error(err)
        )
    }
}
