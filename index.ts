import express, {json} from 'express';
import './utils/config.db';
import 'express-async-errors';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {handleError} from "./utils/errors";
import {paymentRouter} from "./routers/payment.router";
import {categoryRouter} from "./routers/category.router";
import {countryRouter} from "./routers/country.router";
import {loginRouter} from "./routers/login.router";
import {monthRouter} from "./routers/month.router";
import {registrationRouter} from "./routers/registration.router";
import session from "express-session";
import {secret} from "./utils/config.db";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(json());
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10000,
});
app.use(limiter);
app.use('/category', categoryRouter);
app.use('/country', countryRouter);
app.use('/payment', paymentRouter);
app.use('/month', monthRouter);
app.use('/login', loginRouter);
app.use('/registration', registrationRouter);
app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
})
