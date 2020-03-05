#!/bin/env node
import { AbstractCommand } from "./abstractCommand";
import { MessageInfo } from "../lib/types";
import {exec} from 'child_process';

const shellCmd = `node D:\\node\\etvnet\\dist\\app.js do=etv code=`
const command = 'etv'
export class EtvCommand extends AbstractCommand{
    constructor() {
        super(command)
    }
    async action(cmd: string, msgInfo:MessageInfo, params:string[]) {
        console.log(`- ${cmd} Command: [${params.join(', ')}]'`)
        await this.reply(msgInfo, `<@${msgInfo.user}>. Executing Etv`)
        try {
            console.log( await runShellCommand(shellCmd+params[0]))
            await this.reply(msgInfo, `Done`)
        } catch (ex) {
            console.error(ex)
            await this.reply(msgInfo, `Error: ${ex}`)
        }
    }
}

function runShellCommand(cmd: string) {
    return new Promise<string>((resolve, reject) => {
        exec(cmd, function(err, stdout) {
            if (err) return reject(err);
            resolve(stdout);
        });
    });
}