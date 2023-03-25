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
    .get('/names', async (req, res) => {
        const countriesNamesList = await CountryRecord.getNamesOfCountries();
        res.json(countriesNamesList);
    })
    .get('/:id', async (req, res) => {
        const country = await CountryRecord.getOneCountry(req.params.id);
        if (country === null) {
            throw new ValidationError('Niestety kraj z podanym id nie jest jeszcze dostepny')
        }
        res.json(country);
    })
    .post('/', async (req, res) => {
        const countriesList = await CategoryRecord.getNamesOfCategories();
        const names = countriesList.map(country => country.name)
        if (names.includes(req.body.name.toUpperCase())) {
            throw new ValidationError('Podany kraj istnieje, przejdż do dodawania płatności')
        }
        {

            const newCountry = new CountryRecord({
                ...req.body,
                name: (req.body.name).toUpperCase(),
            });
            await newCountry.insertCountry();
            res.json(newCountry)
        }
    })
    .patch('/id/:id', async (req, res) => {
        const country = await CountryRecord.getOneCountry(req.params.id);
        if (country === null) {
            throw new ValidationError('Nie znaleziono kraju o tym ID')
        }
        await country.updateCountry(req.body.name, req.body.currency)
        res.json({ok: true})
    })
    .delete('/id/:id', async (req, res) => {
        const country = await CountryRecord.getOneCountry(req.params.id);
        await country.deleteCountry(req.params.id);
        res.json({ok: true})
    })
