import { AbstractCommand } from './abstractCommand';
import { HelpCommand } from './help';
import { DefaultCommand } from './default';
export const CommandsRegistry: AbstractCommand[] = [
    new HelpCommand(),
    new DefaultCommand
]
