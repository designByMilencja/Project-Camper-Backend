import {AddCategoryEntity, AddNewCategoryEntity} from "../types/add-category.entity";
import {FieldPacket} from "mysql2";
import {pool} from "../utils/db";
import {ValidationError} from "../utils/errors";

type AddCategoryRecordResult = [AddCategoryEntity[], FieldPacket[]];


export class AddCategoryRecord implements AddCategoryEntity {
    id: string;
    name: string;

    constructor(obj: AddNewCategoryEntity) {
        const {name} = obj;
        if (!name || name === '') {
            throw new ValidationError('Wpisz nazwę kategorii, którą chcesz dodać.')
        }
    }

    static async getOneMonth(name: string): Promise<AddCategoryEntity | null> {
        const [results] = (await pool.execute('SELECT * FROM `payments` WHERE `name` = :name', {
            name,
        })) as AddCategoryRecordResult;
        return results.length === 0 ? null : new AddCategoryRecord(results[0]);
    }
}
