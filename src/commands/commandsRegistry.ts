import { AbstractCommand } from './abstractCommand';
import { HelpCommand } from './help';
import { DefaultCommand } from './default';
import { RunCommand as RunLsCommand } from './runls';
export const CommandsRegistry: AbstractCommand[] = [
    new HelpCommand,
    new DefaultCommand,
    new RunLsCommand
]
