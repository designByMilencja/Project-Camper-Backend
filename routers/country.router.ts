import {Router} from "express";
import {CountryRecord} from "../records/country.record";
import {ValidationError} from "../utils/errors";
import {CategoryRecord} from "../records/category.record";

export const countryRouter = Router();
countryRouter

    .get('/', async (req, res) => {
        const countryList = await CountryRecord.getListOfCountries();
        res.json(countryList);
    })
    .get('/:id', async (req, res) => {
        const country = await CountryRecord.getOneCountry(req.params.id);
        if(country === null) {
            throw new ValidationError('Niestety kraj z podanym id nie jest jeszcze dostepny')
        }
        res.json(country);
    })
    .post('/', async (req,res) => {
        const newCountry = new CountryRecord(req.body);
        await newCountry.insertCountry();
        res.json(newCountry)
    })
    .patch('/id/:id', async (req, res) => {
        const country = await CountryRecord.getOneCountry(req.params.id);
        if (country === null) {
            throw new ValidationError('Nie znaleziono kraju o tym ID')
        }
        await country.updateCountry(req.body.name, req.body.currency)
        res.json({ok:true})
    })
    .delete('/id/:id', async (req,res)=> {
        const country = await CountryRecord.getOneCountry(req.params.id);
        await country.deleteCountry(req.params.id);
        res.json({ok:true})
    })
