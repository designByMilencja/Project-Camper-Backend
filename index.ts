import express, {json, Router} from 'express';
import 'express-async-errors';
import session from "express-session";
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import {handleError} from "./utils/errors";
import {paymentRouter} from "./routers/payment.router";
import {categoryRouter} from "./routers/category.router";
import {countryRouter} from "./routers/country.router";
import {loginRouter} from "./routers/login.router";
import {monthRouter} from "./routers/month.router";
import {registrationRouter} from "./routers/registration.router";
import {secret} from "./utils/secret";

const app = express();
app.use(helmet());
app.use(json());
app.use(cors({
    origin: 'http://localhost:3000',
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
const router = Router();
router.use('/category', categoryRouter);
router.use('/country', countryRouter);
router.use('/payment', paymentRouter);
router.use('/month', monthRouter);
router.use('/login', loginRouter);
router.use('/registration', registrationRouter);
app.use('/api', router);
app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
})
