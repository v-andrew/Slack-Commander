import { Message, Self, Team } from './lib/types'
import { config } from 'dotenv'
import { RTMClient, ErrorCode } from '@slack/rtm-api'
import { WebClient} from '@slack/web-api'
import { EventsHandler } from './events/handler'
import HttpsProxyAgent from 'https-proxy-agent'
import { CommandsRegistry } from './commands/commandsRegistry';
config()

const proxyAgent = process.env.http_proxy ? new HttpsProxyAgent(process.env.http_proxy) : null

;(async () => {
  // Start your app
  const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN, proxyAgent ? { agent: proxyAgent }: undefined)
  const web = new WebClient(process.env.SLACK_BOT_TOKEN, proxyAgent ? { agent: proxyAgent } : undefined)
  try {
    const { self, team } = await rtm.start();
    new EventsHandler(self as Self, team as Team, rtm, web)
    console.log(EventsHandler.Commands)
    CommandsRegistry.forEach(c => c.register(EventsHandler.Commands))
    console.dir(self, team)
    console.log('ok')
  } catch (error) {
    if (error.code === ErrorCode.WebsocketError) {
      console.log(error.data);
    } else { 
      // ErrorCode.RequestError ErrorCode.RateLimitedError ErrorCode.HTTPError
      console.log('Well, that was unexpected.');
      console.log(error);
    }
  }
})();
