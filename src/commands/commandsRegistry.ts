import { AbstractCommand } from './abstractCommand';
import { HelpCommand } from './help';
export const CommandsRegistry: AbstractCommand[] = [
    new HelpCommand(),
]
