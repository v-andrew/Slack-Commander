import { AbstractCommand } from './abstractCommand';
import { HelpCommand } from './help';
import { DefaultCommand } from './default';
import { EtvCommand } from './etv';
export const CommandsRegistry: AbstractCommand[] = [
    new HelpCommand,
    new DefaultCommand,
    new EtvCommand
]
