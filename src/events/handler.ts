import { Message, Self, Team, Channel, Reply, Request } from './../lib/types';
import { Observable, fromEvent, Subject } from 'rxjs'
import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import { filter, map, takeUntil, share } from 'rxjs/operators';
import { Command } from '../lib/types';

export class EventsHandler {
    private allSlackMessagesObs: Observable<Message>
    private commandsObs: Observable<Command>
    private requestsSubj: Subject<Request>
    private repliesObs: Observable<Reply>
    private static eventsHandler: EventsHandler = null;
    private channels: string[] = [];
    private _end_ = new Subject();
    constructor(private self: Self, private team: Team, private rtm: RTMClient, private web: WebClient) { 
        if (EventsHandler.eventsHandler) throw 'We can use only one EventsHandler at a time. Please dispose old EventsHandler before creating a new one'
        EventsHandler.eventsHandler = this
    }
    async setup() {
        if (this.allSlackMessagesObs) {
            this._end_.next("complete")
        }
        const userRef: string = `<@${this.self.id}>`
        this.web.conversations.list({ types: 'public_channel' }).then(({channels})=> {
            process.env.DEBUG > '0' && console.log('** Channels: ' + JSON.stringify(channels))
            this.channels = (channels as Channel[]).filter(c => c.is_member === true).map(c => c.id)
        })
        process.env.DEBUG > '0' && console.info('** Subscribe')
        this.allSlackMessagesObs = fromEvent<Message>(this.rtm, 'message').pipe(
            takeUntil(this._end_),
        )
        this.commandsObs = this.allSlackMessagesObs.pipe(
            filter((msg) => {
                process.env.DEBUG > '1' && console.log('** Message: ' + JSON.stringify(msg))
                process.env.DEBUG > '0' && console.log(`- filter:${msg.client_msg_id}, ${msg.event_ts}, ${msg.channel}`)
                if (msg.subtype) {
                    if (msg.subtype === 'bot_message') return false
                    if (msg.subtype === 'message_changed' && msg.message) Object.assign(msg, msg.message)
                }
                if (!msg.text) return false
                msg.is_direct = !this.channels.includes(msg.channel)
                return msg.is_direct || msg.text.startsWith(userRef)
            }),
            map(msg => {
                process.env.DEBUG > '0' && console.log('- map:'+JSON.stringify(msg))
                let params = msg.text.split(' ')
                if(params[0] === userRef || params[0].endsWith(this.self.name)) params.shift()
                const msgInfo = (({ client_msg_id, channel, user }) => ({ client_msg_id, channel, user }))(msg)
                const result: Command = [params.shift(), msgInfo, params]
                return result
            }),
            share(),
        )
    }
    static async sendMessage2Conversation(conversationId: string, text: string) {
        const response = await this.eventsHandler.web.chat.postMessage({
            text: text,
            channel: conversationId,
        })
        return response
    }
    dispose() {
        // Clear static data, close observables
        throw 'Not implemented'
    }
    static get Commands() {
        return this.eventsHandler.commandsObs
    }
    static get AllSlackMessages() {
        return this.eventsHandler.allSlackMessagesObs
    }
    static get Requests() {
        return this.eventsHandler.requestsSubj
    }
    static get Replies() {
        return this.eventsHandler.repliesObs
    }
}
