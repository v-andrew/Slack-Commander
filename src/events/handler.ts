import { Message, Self, Team } from './../lib/types';

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
