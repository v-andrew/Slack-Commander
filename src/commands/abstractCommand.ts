import { Command, MessageInfo } from '../lib/types';
import { EventsHandler } from '../events/handler';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
export abstract class AbstractCommand {
    static registeredCommands: string[] = []
    helpAndUsage = {usage:'Not implemented', command: 'abstract'}
    private readonly command:string
    constructor(command: string, register: boolean = true) {
        this.command = command
        if(register)AbstractCommand.registeredCommands.push(command)
    }
    async reply(srcInfo: MessageInfo, message: string) {
        try {
            await EventsHandler.sendMessage2Conversation(srcInfo.channel, message)
        } catch (ex) {
        }
    }
    filter = filter(cmd => cmd[0].toLowerCase() === this.command)
    abstract async action(cmd: string, msgInfo:MessageInfo, params:string[]): Promise<void>
    register(commands: Observable<Command>) {
        commands
            .pipe(this.filter)
            .subscribe(
                ([cmd, msgInfo, params]: Command) => this.action(cmd, msgInfo, params).catch(
                    reason=>console.error(`- ERROR<${this.constructor.name}>: ${reason}`)
                ),
                err => console.error(err)
            )
    }
}