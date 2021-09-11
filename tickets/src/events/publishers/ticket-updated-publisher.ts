import { Publisher, Subjects, TicketUpdatedEvent } from "@rontickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    
}