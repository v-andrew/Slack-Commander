import { Message, Self, Team, Event, Channel } from './../lib/types';
import { Observable, Observer, fromEvent, Subject } from 'rxjs'
import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Command } from '../lib/types';

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
        // console.log(JSON.stringify(channels))
        const skipUserRefLn = this.userRef.length + 1
        console.info('++ Subscribe')
        this.allMessagesObs = fromEvent<Message>(this.rtm, 'message').pipe(
            map(m => { console.log(`-all:${m.client_msg_id}`); return m }),
            takeUntil(this._end_)
        )
        this.commandsObs = this.allMessagesObs.pipe(
            filter((msg) => {
                console.log(`-filter:${msg.client_msg_id}`)
                return msg.text && (msg.text.startsWith(this.userRef) || !this.channels.includes(msg.channel))
            }),
            map(msg => {
                console.log('-map'+JSON.stringify(msg))
                const params = msg.text.substr(skipUserRefLn).split(' ')
                const msgInfo = (({ client_msg_id, channel, user }) => ({ client_msg_id, channel, user }))(msg)
                const result: Command = [params.shift(), msgInfo, params]
                return result
            })
        )
        this.commandsObs.subscribe(
            x => console.log(JSON.stringify(x)),
            e => console.error('error', e),
            () => console.log("- commandsObs: Complete")
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
