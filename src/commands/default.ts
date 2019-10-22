
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
            cmd => {
                console.log(`- DefaultCommand: @${cmd[1].user}`)
                this.reply(cmd, `Hello @${cmd[1].user}. "${cmd[0]}" ` + defaultMsg)
            },
            err => console.error(err)
        )
    }
}
