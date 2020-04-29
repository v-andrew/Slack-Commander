import {exec} from 'child_process';
import fs from 'fs'
import dotenv from 'dotenv'
export const getOverride = (key: string) => {
    try {
        const envConfig = dotenv.parse(fs.readFileSync('.env.override'))
        if(envConfig[key]) return envConfig[key]
    } catch (ex) { console.error(ex) }
    return null;
}
export const runShellCommand = (cmd: string) => {
    return new Promise<string>((resolve, reject) => {
        exec(cmd, function(err, stdout) {
            if (err) return reject(err);
            resolve(stdout);
        });
    });
}