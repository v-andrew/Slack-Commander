export type MessageInfo = {
  client_msg_id?: string
  channel: string
  user: string
}
export type Command = [string, MessageInfo, string[]] // command, MessageInfo, command parameters string[]
export type Event = {
}
export interface Message {
  type: string
  subtype?: string
  hidden?: boolean
  suppress_notification?: boolean
  client_msg_id?: string
  channel: string
  user: string
  text: string
  ts: string
  deleted_ts?: string
  event_ts?: string
  is_starred?: true
  pinned_to?: string[]
  reactions?: Reaction[]
  edited?: {
      user: string
      ts: string
  }
  user_team?: string
  source_team?: string
}

export type Reaction = {
    name: string,
    count: number,
    users: string[]
}

export interface Team {
    id: string
    name: string
    domain: string
}
export interface Self {
    id: string
    name: string
}
  /*"response_metadata": {
    "scopes": [
      "identify",
      "bot:basic"
    ],
    "acceptedScopes": [
      "rtm:stream",
      "client"
    ]
  }*/