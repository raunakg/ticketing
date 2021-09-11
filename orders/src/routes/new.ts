import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@rontickets/common";
import  express, { Request, Response}  from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId') // check if it is a real mongo ID, but fails when Ticket database is migrated from mongo
            .not()
            .isEmpty()
            //.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TicketId must be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            throw new NotFoundError();
        }

        // Make sure the ticket is not already reserved
        // Run query to look at all orders. Find the order where the ticket we just found *and* 
        // the order status is not cancelled

        // const existingOrder = await Order.findOne({
        //     ticket: ticket,
        //     status: {
        //         $in: [
        //             OrderStatus.Created,
        //             OrderStatus.AwaitingPayment,
        //             OrderStatus.Complete                    
        //         ]
        //     }
        // });

        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Ticket is alreday reserved');
        }

        // Calculate an expiration date for the order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and  save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await order.save();

        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(), // convert UTC string
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        })

        res.status(201).send(order);
});

export { router as newOrderRouer };


/* 
Linking orders and ticket together
1. Embedding tickets in order
2. Ref/population feature
*/

