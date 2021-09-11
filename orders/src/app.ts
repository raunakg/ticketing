import express from 'express';
import 'express-async-errors'
import  { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@rontickets/common'
import { deleteOrderRouer } from './routes/delete';
import { indexOrderRouer } from './routes/index';
import { showOrderRouer } from './routes/show';
import { newOrderRouer } from './routes/new';




const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(newOrderRouer);
app.use(showOrderRouer);
app.use(indexOrderRouer);
app.use(deleteOrderRouer);



app.all('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app };