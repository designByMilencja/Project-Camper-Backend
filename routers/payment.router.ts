import {Router} from "express";
import {PaymentRecord} from "../records/payment.record";
import {ValidationError} from "../utils/errors";
export const paymentRouter = Router();
paymentRouter

    .get('/', async (req, res) => {
        const paymentsList = await PaymentRecord.getListOfPayments();
        res.json(paymentsList);
    })
    .get('/:id', async (req, res) => {
        const payment = await PaymentRecord.getOnePayment(req.params.id);
        if(payment === null) {
            throw new ValidationError('Niestety wydatek z podanym id nie jest dostępny')
        }
        res.json(payment);
    })
    .get('/sum/:idCategory', async(req, res)=> {
        const categorySum = await PaymentRecord.sumOneCategory(req.params.idCategory)
        res.json(categorySum)
    })
    .get('/sum/month/:idCategory/:month', async(req, res)=> {
        const allowList =[1,2,3,4,5,6,7,8,9,10,11,12];
        console.log(req.params.month)
        if (!allowList.includes(Number(req.params.month))){
            throw new ValidationError('Przepraszamy, ale podany miesiąc nie istnieje')
        }
        const sumOneCategoryInMonth = await PaymentRecord.sumOneCategoryInOneMonth(req.params.idCategory, Number(req.params.month))
        res.json(sumOneCategoryInMonth)
    })
    .get('/sum/all/:month', async(req, res)=> {
        const sumAllCategoriesInMonth = await PaymentRecord.sumAllCategoriesInOneMonth( Number(req.params.month))
        res.json(sumAllCategoriesInMonth)
    })
    .get('/sum/country/:idCategory/:idPlace', async(req, res)=> {
        const sumOneCategoryInCountry = await PaymentRecord.sumOneCategoryInOneCountry(req.params.idCategory, req.params.idPlace)
        res.json(sumOneCategoryInCountry)
    })
    .get('/sum/all/categories/:idPlace', async(req, res)=> {
        const sumAllCategoriesInOneCountry = await PaymentRecord.sumAllCategoriesInOneCountry(req.params.idPlace)
        res.json(sumAllCategoriesInOneCountry)
    })
    .get('/sum/year/:year', async(req, res)=> {
        const sumAllCategoriesInOneYear = await PaymentRecord.sumAllCategoriesInOneYear(Number(req.params.year))
        res.json(sumAllCategoriesInOneYear)
    })


    .post('/', async (req,res) => {
        const data = {
            ...req.body,
            cost: Number(req.body.cost)
        }
        console.log(data)
        const newPayment = new PaymentRecord(data);
        await newPayment.insertPayment();
        res.json(newPayment)
    })



