import express, {json} from 'express';
import './utils/db';
import 'express-async-errors';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {handleError} from "./utils/errors";
import {paymentRouter} from "./routers/payment.router";
import {categoryRouter} from "./routers/category.router";
import {countryRouter} from "./routers/country.router";
import {loginRouter} from "./routers/login.router";
import {monthRouter} from "./routers/month.router";

const app = express();
app.use(json());
app.use(cors({
    origin: 'http://localhost:3000'}));

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use(limiter);
app.use('/payment', paymentRouter)
app.use('/category', categoryRouter)
app.use('/country', countryRouter)
app.use('/login', loginRouter)
app.use('/month', monthRouter)
app.use(handleError);

app.listen(3001, '0.0.0.0', ()=> {
    console.log('Listening on http://localhost:3001')
})
