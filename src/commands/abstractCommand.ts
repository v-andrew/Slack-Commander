import { Command } from '../lib/types';
import { EventsHandler } from '../events/handler';
import { HelpCommand } from './help';
import { Observable } from 'rxjs';
export abstract class AbstractCommand {
    async reply(cmd: Command, message: string) {
        await EventsHandler.sendMessage2Conversation(cmd[1].channel, message)
    }
    abstract register(commands: Observable<Command>)
}
