import  request  from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import  mongoose from 'mongoose';
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
    var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51JXVQ6SFGTK6CPeoQVWwr7v8DlBpAGicA1dF0cGobRS4w6p5m5K9MY6N2mYrsiQCB762cH7c03sB8XNI6HTdKTh600dHM6nmEj'

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach( async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll( async () => {
    await mongo.stop();
    await mongoose.connection.close();
})


global.signin =  (id?: string) => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    // Build a session object. {jwt: MY_JWT}
    const session = { jwt: token }

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
}
