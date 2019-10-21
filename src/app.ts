import { Message, Self, Team } from './lib/types'
import { config } from 'dotenv'
import { RTMClient, ErrorCode } from '@slack/rtm-api'
import { WebClient, ConversationsListArguments} from '@slack/web-api'
import { EventsHandler } from './events/handler'
import { fromEvent, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import HttpsProxyAgent from 'https-proxy-agent'
config()

const conversationId = 'CH0QV1CFP'
const proxyAgent = process.env.http_proxy ? new HttpsProxyAgent(process.env.http_proxy) : null

;(async () => {
  // Start your app
  const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN, proxyAgent ? { agent: proxyAgent }: undefined)
  const web = new WebClient(process.env.SLACK_BOT_TOKEN, proxyAgent ? { agent: proxyAgent } : undefined)
  const handler = new EventsHandler()
  const obs = fromEvent<Message>(rtm, 'message')
  obs.subscribe(x => console.dir('message', x), e => console.error('error', e));
  try {
    const { self, team } = await rtm.start();
    console.dir(self, team)
    const userRef = `<@${(self as Self).id}>`
    const finalObs = obs.pipe(filter((msg) => msg.text.startsWith(userRef) ))
    finalObs.subscribe(x => console.log(JSON.stringify(x)), e => console.error('error', e));
    // const response = await rtm.sendMessage('Hello', conversationId)
    handler.setup(self, team)
    console.log('ok')
  } catch (error) {
    if (error.code === ErrorCode.WebsocketError) {
      console.log(error.data);
    } else { 
      // ErrorCode.RequestError ErrorCode.RateLimitedError ErrorCode.HTTPError
      console.log('Well, that was unexpected.');
    }
  }
})();
