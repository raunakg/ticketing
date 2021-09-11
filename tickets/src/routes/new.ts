import  express, { Request, Response }  from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@rontickets/common";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
    '/api/tickets', 
    requireAuth, [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),

        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than zero')

    ],
    validateRequest,
    async (req:Request, res:Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        });
        await ticket.save();

        // Database Transaction = save multiple if fails fail both and undo changes, two collection data save and event collection, if event published yes  and save

        await  new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })

        res.status(201).send(ticket)
})

export { router as createTicketRouter } ;