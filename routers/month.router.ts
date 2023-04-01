import {Router, Request,Response} from "express";
import {ValidationError} from "../utils/errors";
import {MonthRecord} from "../records/month.record";

export const monthRouter = Router();
monthRouter
    .get('/', async (req:Request, res:Response) => {
        const monthList = await MonthRecord.getListOfMonths();
        res.json(monthList);
    })
    .get('/:id', async (req:Request, res:Response) => {
        const month = await MonthRecord.getOneMonth(req.params.id);
        if (!month) {
            throw new ValidationError('Niestety miesiąc o podanym id nie istnieje')
        }
        res.json(month);
    })
