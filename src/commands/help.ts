import { AbstractCommand } from "./abstractCommand";
import { Observable } from "rxjs";
import { Command } from "../lib/types";
import { filter } from 'rxjs/operators';

export class HelpCommand extends AbstractCommand{
    register(commands: Observable<Command>) {
        commands.pipe(
            filter(cmd => cmd[0].toLowerCase() === 'help')
        ).subscribe(
            cmd => {
                console.log(`- HelpCommand: 'Hello @${cmd[1].user}'`)
                this.reply(cmd, `Hello @${cmd[1].user}`)
            },
            err => console.error(err)
        )
    }
}
