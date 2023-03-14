import {Router} from "express";
import {PlaceRecord} from "../records/place.record";
import {ValidationError} from "../utils/errors";

export const placeRouter = Router();
placeRouter

    .get('/', async (req, res) => {
        const placesList = await PlaceRecord.getAllPlaces();
        res.json(placesList);
    })
    .get('/:id', async (req, res) => {
        const place = await PlaceRecord.getOnePlace(req.params.id);
        if(place === null) {
            throw new ValidationError('Niestety miejsce z podanym id nie jest dostępne')
        }
        res.json(place);
    })
    .post('/', async (req,res) => {
        const newPlace = new PlaceRecord(req.body);
        await newPlace.insertPlace();
        res.json(newPlace)
    })
