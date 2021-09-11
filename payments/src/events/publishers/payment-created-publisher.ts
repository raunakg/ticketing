import { PaymentCreatedEvent, Publisher, Subjects } from "@rontickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}