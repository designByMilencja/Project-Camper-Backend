import {Router} from "express";
import {PaymentRecord} from "../records/payment.record";
import {ValidationError} from "../utils/errors";

export const paymentRouter = Router();
paymentRouter

    .get('/', async (req, res) => {
        const paymentsList = await PaymentRecord.getAllPayments();
        res.json(paymentsList);
    })
    .get('/sum/:idCategory', async(req, res)=> {
        const sum = await PaymentRecord.sumPaymentsAtOneCategory(req.params.idCategory)
        res.json(sum)
    })
    .get('/:id', async (req, res) => {
        const payment = await PaymentRecord.getOnePayment(req.params.id);
        if(payment === null) {
            throw new ValidationError('Niestety wydatek z podanym id nie jest dostępny')
        }
        res.json(payment);
    })
    .post('/', async (req,res) => {
        const data = {
            ...req.body,
            cost: Number(req.body.cost)
        }
        const newPayment = new PaymentRecord(data);
        await newPayment.insertPayment();
        res.json(newPayment)
    })



