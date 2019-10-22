import { Command } from '../lib/types';
import { EventsHandler } from '../events/handler';
import { Observable } from 'rxjs';
export abstract class AbstractCommand {
    static commands: string[] = []
    constructor(command: string, register: boolean = true) {
        if(register)AbstractCommand.commands.push(command)
    }
    async reply(cmd: Command, message: string) {
        await EventsHandler.sendMessage2Conversation(cmd[1].channel, message)
    }
    abstract register(commands: Observable<Command>)
}
