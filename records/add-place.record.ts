import {AddNewPlaceEntity, AddPlaceEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type PlaceRecordResult = [AddPlaceEntity[], FieldPacket[]];

export class AddPlaceRecord implements AddPlaceEntity {
    id: string;
    name: string;
    currency: string;

    constructor(obj: AddNewPlaceEntity) {
        const {name, currency} = obj;
        if (!name || name === '') {
            throw new ValidationError('Wpisz nazwę miejsca, które chcesz dodać.')
        }
        if (!currency || currency === '') {
            throw new ValidationError('Wybierz walutę, która obowiązuje w wybranym miejscu.')
        }
    }

    static async getOnePlace(id: string): Promise<AddPlaceEntity | null> {
        const [results] = (await pool.execute('SELECT * FROM `places` WHERE `id` = :id', {
            id,
        })) as PlaceRecordResult;
        return results.length === 0 ? null : new AddPlaceRecord(results[0]);
    }
}
