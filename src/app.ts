import { config } from 'dotenv'
import { RTMClient, ErrorCode } from '@slack/rtm-api'
import { WebClient, ConversationsListArguments} from '@slack/web-api'
import { EventsHandler } from './events/handler';

config();
const conversationId = 'CH0QV1CFP'
let slackUrl: string
;(async () => {
  // Start your app
  const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN)
  const web = new WebClient(process.env.SLACK_BOT_TOKEN)
  const handler = new EventsHandler()
  rtm.on('message', (event) => {
    handler.accept(event)
  });
  try {
    const list = await web.conversations.list({ exclude_archived: true })
    console.log('list', JSON.stringify(list))
    const { url, self, team } = await rtm.start();
    slackUrl = url as string
    // const responce = await rtm.sendMessage('Hello', conversationId)
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
