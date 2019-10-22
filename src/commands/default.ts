
import { AbstractCommand } from "./abstractCommand";
import { Observable } from "rxjs";
import { Command } from "../lib/types";
import { filter } from 'rxjs/operators';

const defaultMsg = `is not in a list of recognized commands.
You can use \`help\` to see list of available commands and parameters`

const command = 'default'
export class DefaultCommand extends AbstractCommand{
    constructor() {
        super(command, false)
    }
    register(commands: Observable<Command>) {
        commands.pipe(
            filter(cmd => !AbstractCommand.commands.includes(cmd[0].toLowerCase()))
        ).subscribe(
            ([cmd, msgInfo, params]) => {
                console.log(`- DefaultCommand: @${msgInfo.user}`)
                this.reply(msgInfo, `Hello @${msgInfo.user}. "${cmd}" ` + defaultMsg)
                if(cmd === 'DEBUG') process.env.DEBUG = params[0]
            },
            err => console.error(err)
        )
    }
}
