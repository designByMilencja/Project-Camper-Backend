import {PlaceEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type PlaceRecordResult = [PlaceEntity[], FieldPacket[]];

export class PlaceRecord implements PlaceEntity {
    id: string;
    name: string;
    currency: string;

    constructor(obj: PlaceEntity) {
        const {id, name, currency} = obj;
        this.id = id;
        this.name = name;
        this.currency = currency;
        if (!name || name === '') {
            throw new ValidationError('Wpisz nazwę miejsca, które chcesz dodać.')
        }
        if (name.length > 60) {
            throw new ValidationError('Nazwa miejsca, nie może przekraczać 60 znaków.')
        }
        if (!currency || currency === '') {
            throw new ValidationError('Wybierz walutę, która obowiązuje w wybranym miejscu.')
        }
    }

    async insertPlace(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert sth that is already added!');
        }
        await pool.execute('INSERT INTO `places` VALUES (:id, :name, :currency)', {
            id:this.id,
            name:this.name,
            currency:this.currency,
        });
        return this.id;
    }

    static async getOnePlace(id: string): Promise<PlaceEntity> {
        const [results] = await pool.execute('SELECT * FROM `places` WHERE `id`= :id', {
            id,
        }) as PlaceRecordResult;
        return results.length === 0 ? null : new PlaceRecord(results[0]);
    }

    static async getAllPlaces(): Promise<PlaceEntity[]> {
        const [results] = await pool.execute('SELECT * FROM `places`') as PlaceRecordResult;
        return results.map(obj => new PlaceRecord(obj));
    }
}
