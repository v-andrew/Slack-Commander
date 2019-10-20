import { config } from 'dotenv'
import { WebClient } from '@slack/client'
config();

const conversationId = 'chat-bot';

(async () => {
  // Start your app
  const web = new WebClient(process.env.SLACK_BOT_TOKEN, )

  const msg = {
    text: 'Hello world!',
    channel: conversationId,
  }
  const result = await web.chat.postMessage(msg)
  console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
})();
