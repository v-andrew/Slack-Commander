#!/bin/env node
import { AbstractCommand } from "./abstractCommand";
import { MessageInfo } from "../lib/types";
import {exec} from 'child_process';

const command = 'etv'
export class EtvCommand extends AbstractCommand{
    shellCmd = `node D:\\node\\etvnet\\dist\\app.js do=etv code=`
    helpAndUsage = {usage:'`etv` `code` - registers tv device which shows `code` on the screen', command: command}
    constructor() {
        super(command)
        if (process.env.shellCmd) this.shellCmd = process.env.shellCmd
    }
    async action(cmd: string, msgInfo:MessageInfo, params:string[]) {
        console.log(`- ${cmd} Command: [${params.join(', ')}]'`)
        await this.reply(msgInfo, `<@${msgInfo.user}>. Executing Etv`)
        try {
            const fs = require('fs')
            const dotenv = require('dotenv')
            try {
                const envConfig = dotenv.parse(fs.readFileSync('.env.override'))
                if(envConfig['shellCmd']) this.shellCmd = envConfig['shellCmd']
            } catch(ex){ console.error(ex)}
            const shOut = await runShellCommand(this.shellCmd + params[0])
            await this.reply(msgInfo, `Done: ${shOut}`)
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