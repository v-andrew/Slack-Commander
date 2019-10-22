import { config } from 'dotenv'
config()
import url from 'url'
import { Self, Team } from './lib/types'
import { EventsHandler } from './events/handler'
import { CommandsRegistry } from './commands/commandsRegistry'
import { ErrorCode, RTMClient } from '@slack/rtm-api'
import { WebClient } from '@slack/web-api'
import HttpsProxyAgent = require('https-proxy-agent');

;(async () => {
  // Start your app
  try {
    const [web, rtm] = getSlackClients()
    const { self, team } = await rtm.start();
    await (new EventsHandler(self as Self, team as Team, rtm, web)).setup()
    console.log(EventsHandler.Commands)
    CommandsRegistry.forEach(c => c.register(EventsHandler.Commands))
    console.dir(self, team)
    console.log('ok')
  } catch (error) {
    if (error.code === ErrorCode.WebsocketError) {
      console.log(error.data);
    } else { 
      // ErrorCode.RequestError ErrorCode.RateLimitedError ErrorCode.HTTPError
      console.log('Well, that was unexpected.')
      console.log(error)
    }
  }
})();

function getSlackClients(): [WebClient, RTMClient] {
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
