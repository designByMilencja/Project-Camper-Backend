import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import {handleError} from "./utils/errors";
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.json());
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use(limiter);
app.use(handleError);

app.listen(3001, '0.0.0.0', ()=> {
    console.log('Listening on http://localhost:3001')
})
