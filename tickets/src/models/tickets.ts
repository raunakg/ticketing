import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;

}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;

}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: { // for reserving a ticket
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin); // only ticket service will increment version number


ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('ticket', ticketSchema);


export { Ticket }