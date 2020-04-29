#!/bin/env node
import { AbstractCommand } from "./abstractCommand";
import { MessageInfo } from "../lib/types";
import { getOverride, runShellCommand } from "../utils/utils";

const command = 'runls'
export class RunCommand extends AbstractCommand{
    shellCmd = `ls`
    helpAndUsage = {usage:'`runls` `path` - executes `ls` command on the server', command: command}
    constructor() {
        super(command)
        if (process.env.shellCmd) this.shellCmd = process.env.shellCmd
    }
    async action(cmd: string, msgInfo:MessageInfo, params:string[]) {
        console.log(`- ${cmd} Command: [${params.join(', ')}]'`)
        await this.reply(msgInfo, `<@${msgInfo.user}>. Executing RunLs`)
        try {
            const overrideCmd = getOverride('runlsCmd')
            if(overrideCmd != null) this.shellCmd = overrideCmd
            const shOut = await runShellCommand(this.shellCmd + ' ' + params.join(' '))
            await this.reply(msgInfo, `Done: ${shOut}`)
        } catch (ex) {
            console.error(ex)
            await this.reply(msgInfo, `Error: ${ex}`)
        }
    }
}
