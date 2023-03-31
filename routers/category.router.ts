import {Router} from "express";
import {CategoryRecord} from "../records/category.record";
import {ValidationError} from "../utils/errors";
import {verifyToken} from "../utils/verifyToken";

export const categoryRouter = Router();

categoryRouter

    .get('/', async (req, res) => {
        const categoriesList = await CategoryRecord.getListOfCategories();
        res.json(categoriesList);
    })
    .get('/names', async (req, res) => {
        const categoriesNamesList = await CategoryRecord.getNamesOfCategories();
        res.json(categoriesNamesList);
    })
    .get('/:id', async (req, res) => {
        const category = await CategoryRecord.getOneCategory(req.params.id);
        if (category === null) {
            throw new ValidationError('Niestety kategoria z podanym id nie jest dostępna')
        }
        res.json(category);
    })
    .post('/', verifyToken, async (req, res) => {
        console.log(req.body)
        const categoriesList = await CategoryRecord.getNamesOfCategories();
        const names = categoriesList.map(category => category.name)
        if (names.includes(req.body.name.toUpperCase())) {
            throw new ValidationError('Podana kategoria istnieje, przejdż do dodawania płatności')
        }
        {
            const newCategory = new CategoryRecord({
                ...req.body,
                name: (req.body.name).toUpperCase(),
            });
            await newCategory.insertCategory();
            res.json(newCategory)
        }
    })
    .patch('/:id', async (req, res) => {
        const category = await CategoryRecord.getOneCategory(req.params.id);
        if (category === null) {
            throw new ValidationError('Nie znaleziono kategorii o tym ID')
        }
        await category.updateCategory(req.body.name)
        res.json({ok: true})
    })
    .delete('/:id', async (req, res) => {
        const foundToDelete = await CategoryRecord.getOneCategory(req.params.id);
        await foundToDelete.deleteCategory(req.params.id);
        res.json({ok: true})
    })



