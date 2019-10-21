import { Message, Self, Team, Event } from './../lib/types';
import { Observable, Observer } from 'rxjs'

let EventsObserver: Observer<Message>;
export const IncomingSlackMessages:Observable<Message> = Observable.create((observer) => {
    EventsObserver = observer
})
export class EventsHandler {
    self: Self
    team: Team
    setup(self, team) {
        this.self = self
        this.team = team
    }
    accept(event: Message) {
        console.dir(event);
    }
}
