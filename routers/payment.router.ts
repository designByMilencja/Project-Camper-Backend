import {Router, Request, Response} from "express";
import {PaymentRecord} from "../records/payment.record";
import {ValidationError} from "../utils/errors";
import {MonthRecord} from "../records/month.record";
import {verifyToken} from "../utils/verifyToken";
export const paymentRouter = Router();
paymentRouter

    .get('/', async (req: Request, res:Response) => {
        const paymentsList = await PaymentRecord.getListOfPayments();
        res.json(paymentsList);
    })
    .get('/:id', async (req:Request, res:Response) => {
        const payment = await PaymentRecord.getOnePayment(req.params.id);
        if (payment === null) {
            throw new ValidationError('Niestety wydatek z podanym id nie jest dostępny')
        }
        res.json(payment);
    })
    .get('/sum/:idCategory', async (req:Request, res:Response) => {
        const categorySum = await PaymentRecord.sumOneCategory(req.params.idCategory)
        res.json(categorySum)
    })
    .get('/sum/month/:idCategory/:month', async (req:Request, res:Response) => {
        const allowList = await MonthRecord.getListOfMonthsNumbers();
        if (!allowList.includes(Number(req.params.month))) {
            throw new ValidationError('Przepraszamy, ale podany miesiąc nie istnieje')
        }
        const sumOneCategoryInMonth = await PaymentRecord.sumOneCategoryInOneMonth(req.params.idCategory, Number(req.params.month))
        res.json(sumOneCategoryInMonth)
    })
    .get('/sum/all/months/:month', async (req:Request, res:Response) => {
        const sumAllCategoriesInMonth = await PaymentRecord.sumAllCategoriesInOneMonth(Number(req.params.month))
        res.json(sumAllCategoriesInMonth)
    })
    .get('/sum/country/:idCategory/:idCountry', async (req:Request, res:Response) => {
        const sumOneCategoryInCountry = await PaymentRecord.sumOneCategoryInOneCountry(req.params.idCategory, req.params.idCountry)
        res.json(sumOneCategoryInCountry)
    })
    .get('/sum/all/categories/:idCountry', async (req:Request, res:Response) => {
        const sumAllCategoriesInOneCountry = await PaymentRecord.sumAllCategoriesInOneCountry(req.params.idCountry)
        res.json(sumAllCategoriesInOneCountry)
    })
    .get('/sum/year/:year', async (req:Request, res:Response) => {
        const sumAllCategoriesInOneYear = await PaymentRecord.sumAllCategoriesInOneYear(Number(req.params.year))
        res.json(sumAllCategoriesInOneYear)
    })


    .post('/', verifyToken, async (req:Request, res:Response) => {
        const data = {
            ...req.body,
            cost: Number(req.body.cost)
        }
        console.log(data)
        const newPayment = new PaymentRecord(data);
        await newPayment.insertPayment();
        res.json(newPayment)
    })



