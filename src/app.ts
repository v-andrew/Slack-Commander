import { config } from 'dotenv'
config()
import { Self, Team } from './lib/types'
import { EventsHandler } from './events/handler'
import { CommandsRegistry } from './commands/commandsRegistry';
import { getSlackClients } from './utils/getSlackClients'

;import { ErrorCode } from '@slack/rtm-api';
(async () => {
  // Start your app
  try {
    const [web, rtm] = getSlackClients()
    const channels = await web.conversations.list({ types: 'private_channel' })
    console.log(JSON.stringify(channels))
    const direct = await web.im.list()
    console.log(JSON.stringify(direct))
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
      console.log('Well, that was unexpected.');
      console.log(error);
    }
  }
})();
