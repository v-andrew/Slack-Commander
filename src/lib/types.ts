export type Request = {

}
export type Reply = {
  
}
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
  message?: Message
  edited?: {
      user: string
      ts: string
  }
  user_team?: string
  source_team?: string
  is_direct?: boolean
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

export type Channel = {
  id: string
  name: string
  is_channel: boolean
  is_group: boolean
  is_im: boolean
  created: number
  is_archived: boolean
  is_general: boolean
  unlinked: number
  name_normalized: string
  is_shared: boolean
  parent_conversation?: any,
  creator: string
  is_ext_shared: boolean
  is_org_shared: boolean
  shared_team_ids: string[],
  pending_shared: string[],
  pending_connected_team_ids: string[],
  is_pending_ext_shared: boolean
  is_member: boolean
  is_private: boolean
  is_mpim: boolean
  topic: {}
  purpose: {}
  previous_names: string[]
  num_members: number
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