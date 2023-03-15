import {Router} from "express";
import {CategoryRecord} from "../records/category.record";
import {ValidationError} from "../utils/errors";

export const categoryRouter = Router();
categoryRouter

    .get('/', async (req, res) => {
        const categoriesList = await CategoryRecord.getListOfCategories();
        res.json(categoriesList);
    })
    .get('/:id', async (req, res) => {
        const category = await CategoryRecord.getOneCategory(req.params.id);
        if(category === null) {
            throw new ValidationError('Niestety kategoria z podanym id nie jest dostępna')
        }
        res.json(category);
    })
    .post('/', async (req,res) => {
        console.log(req.body)
        const newCategory = new CategoryRecord(req.body);
        await newCategory.insertCategory();
        res.json(newCategory)
    })
    .patch('/id/:id', async (req, res) => {
        const category = await CategoryRecord.getOneCategory(req.params.id);
        if (category === null) {
            throw new ValidationError('Nie znaleziono kategorii o tym ID')
        }
        await category.updateCategory(req.body.name)
        res.json({ok:true})
    })
    .delete('/id/:id', async (req,res)=> {
        const foundToDelete = await CategoryRecord.getOneCategory(req.params.id);
        await foundToDelete.deleteCategory(req.params.id);
        res.json({ok:true})
    })



