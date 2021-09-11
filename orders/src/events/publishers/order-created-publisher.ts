import { OrderCreatedEvent, Publisher, Subjects } from "@rontickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}