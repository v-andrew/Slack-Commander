import { Message, Self, Team, Event, Channel } from './../lib/types';
import { Observable, Observer, fromEvent, Subject, fromEventPattern } from 'rxjs'
import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import { filter, map, takeUntil, share, distinct, distinctUntilChanged } from 'rxjs/operators';
import { Command } from '../lib/types';
import { AbstractCommand } from '../commands/abstractCommand';

export class EventsHandler {
    private allMessagesObs: Observable<Message>
    private commandsObs: Observable<Command>
    private userRef: string
    private static eventsHandler: EventsHandler = null;
    private channels: string[] = [];
    private _end_ = new Subject();
    constructor(private self: Self, private team: Team, private rtm: RTMClient, private web: WebClient) { 
        if (EventsHandler.eventsHandler) throw 'We can use only one EventsHandler at a time. Please dispose old EventsHandler before creating a new one'
        EventsHandler.eventsHandler = this
        this.userRef = `<@${self.id}>`
    }
    async setup() {
        if (this.allMessagesObs) {
            this._end_.next("complete")
        }
        const channels = (await this.web.conversations.list({ types: 'public_channel' })).channels as Channel[]
        this.channels = channels.filter(c=>c.is_member === true).map(c=>c.id)
        process.env.DEBUG > '0' && console.log('** Channels: ' + JSON.stringify(channels))
        process.env.DEBUG > '0' && console.info('** Subscribe')
        this.allMessagesObs = fromEvent<Message>(this.rtm, 'message').pipe(
            takeUntil(this._end_),
        )
        this.commandsObs = this.allMessagesObs.pipe(
            filter((msg) => {
                process.env.DEBUG > '1' && console.log('** Message: ' + JSON.stringify(msg))
                process.env.DEBUG > '0' && console.log(`- filter:${msg.client_msg_id}, ${msg.event_ts}, ${msg.channel}`)
                if (msg.subtype) {
                    if (msg.subtype === 'bot_message') return false
                    if (msg.subtype === 'message_changed' && msg.message) Object.assign(msg, msg.message)
                }
                if (!msg.text) return false
                msg.is_direct = !this.channels.includes(msg.channel)
                return msg.is_direct || msg.text.startsWith(this.userRef)
            }),
            map(msg => {
                process.env.DEBUG > '0' && console.log('- map:'+JSON.stringify(msg))
                const params = msg.text.split(' ')
                if(params[0] === this.userRef) params.shift
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
    static get AllMessages() {
        return this.eventsHandler.allMessagesObs
    }
}
