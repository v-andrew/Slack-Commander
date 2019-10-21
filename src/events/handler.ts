import { Message, Self, Team, Event } from './../lib/types';
import { Observable, Observer, fromEvent } from 'rxjs'
import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import { filter, map } from 'rxjs/operators';
import { Command } from '../lib/types';

export class EventsHandler {
    private allMessagesObs: Observable<Message>
    private commandsObs: Observable<Command>
    private userRef: string
    private static eventsHandler: EventsHandler = null;
    constructor(private self: Self, private team: Team, private rtm: RTMClient, private web: WebClient) { 
        if (EventsHandler.eventsHandler) throw 'We can use only one EventsHandler at a time. Please dispose old EventsHandler before creating a new one'
        EventsHandler.eventsHandler = this
        this.allMessagesObs = fromEvent<Message>(rtm, 'message')
        this.userRef = `<@${self.id}>`
        const skipUserRefLn = this.userRef.length + 1
        this.commandsObs = this.allMessagesObs.pipe(
            filter((msg) => msg.text && msg.text.startsWith(this.userRef)),
            map(msg => {
                console.log(JSON.stringify(msg))
                const params = msg.text.substr(skipUserRefLn).split(' ')
                const msgInfo = (({ client_msg_id, channel, user }) => ({ client_msg_id, channel, user }))(msg)
                const result: Command = [params.shift(), msgInfo, params]
                return result
            })
        )
        this.commandsObs.subscribe(x => console.log(JSON.stringify(x)), e => console.error('error', e))
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
