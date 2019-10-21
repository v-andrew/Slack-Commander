import url from 'url'
import HttpsProxyAgent from 'https-proxy-agent'
import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';

export function getSlackClients(): [WebClient, RTMClient] {
    let proxyAgent: HttpsProxyAgent = null
    if (process.env.http_proxy) {
        const proxyOpts: any = url.parse(process.env.http_proxy);
        proxyOpts.auth = process.env.U_P;
        proxyAgent = new HttpsProxyAgent(proxyOpts)
    }
    const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN, proxyAgent ? { agent: proxyAgent } : undefined)
    const web = new WebClient(process.env.SLACK_BOT_TOKEN, proxyAgent ? { agent: proxyAgent } : undefined)
    return [web, rtm]
}
