import { AbstractCommand } from './abstractCommand';
import { HelpCommand } from './help';
import { DefaultCommand } from './default';
import { RunCommand } from './run';
export const CommandsRegistry: AbstractCommand[] = [
    new HelpCommand,
    new DefaultCommand,
    new RunCommand
]
