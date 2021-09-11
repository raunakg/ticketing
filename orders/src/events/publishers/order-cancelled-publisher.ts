import { OrderCancelledEvent, Publisher, Subjects } from "@rontickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}