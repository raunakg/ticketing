import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS')

    stan.on('close', () => {
        console.log('NATS connection closed!')
        process.exit()
    })

    new TicketCreatedListener(stan).listen();

    // const options = stan
    //     .subscriptionOptions()
    //     .setManualAckMode(true) // Manually Acknowledge
    //     .setDeliverAllAvailable()
    //     .setDurableName('order-service') // keeps track which events has been delivered

    // const subscription = stan.subscribe(
    //     'ticket:created', 
    //     'orders-service-queue-group', // queue group to listen only once for multiple instance of same service
    //     options
    // ); 

    // subscription.on('message', (msg: Message) => {
    //     const data = msg.getData();

    //     if(typeof data === 'string') {
    //         console.log(`Recieved event #${msg.getSequence()}, with data: ${data}`)
    //     }

    //     msg.ack();
    // })
})

process.on('SIGINT', () => stan.close()); // works on Linux
process.on('SIGTERM', () => stan.close()); // works on Linux




