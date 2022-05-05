# Interactive slack bot

- Interactive Slack bot

## Installation

1. Clone source code
1. Install nodejs runtime
1. Install typescript `npm install -g typescript`
1. Install dependencies `npm install`
1. Create `classic` bot as you need `RTM` API
   1. Open https://api.slack.com/rtm
   1. At the bottom of the page click button `[Create a classic Slack app]`
   1. In window `Create a Slack App (Classic)` register your Slack bot and assign it to workspace
1. Get key `xoxb-` and add it to .env file
1. Add permissions to a bot
   - Minimum permissions:
   1. `bot` - Add the ability for people to direct message or mention @bot
   2. `im:read` - View basic information about the user’s direct messages
   3. `incoming-webhook` - Post messages to specific channels in Slack
   4. `users:write` - Set the user’s presence

## Connection
- Bot uses Websocket for two way communications so there is no need to open forts for incomig traffic.

### Parameters

Bot supports configuration parameters in `environment` or in `.env` file.
- `SLACK_SIGNING_SECRET`=
- `SLACK_BOT_TOKEN_B`= xoxb-
- `SLACK_BOT_TOKEN_P`= xoxp-
- `DEBUG`=0

**For environment with proxy**
- `NODE_TLS_REJECT_UNAUTHORIZED`=0
- `U_P`=user:password - `password` should be base64 encoded

### Configuration files
- `.env.common` - example of configuration file with actual values missing or replcated with stubs
- `.env` - file to override environment variables
- `.env.override` - override values hardcoded in the application. For exmaple path to executable for `run` command
