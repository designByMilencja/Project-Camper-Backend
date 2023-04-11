import {CategoryEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/config.db";
import {FieldPacket} from "mysql2";

type CategoryRecordResult = [CategoryEntity[], FieldPacket[]];

export class CategoryRecord implements CategoryEntity {
    id: string;
    name: string;

    constructor(obj: CategoryEntity) {
        const {id, name} = obj;
        this.id = id;
        this.name = name;

        if (!name || name === '') {
            throw new ValidationError('Wpisz nazwę kategorii, którą chcesz dodać.')
        }
        if (name.length > 57) {
            throw new ValidationError('Nazwa kategorii, nie może być dłuższa niż 50 znaków.')
        }
        if (name.length < 4) {
            throw new ValidationError('Nazwa kategorii, nie może być krótsza niż 4 znaki.')
        }
    }

    async insertCategory(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert sth that is already added!');
        }
        await pool.execute('INSERT INTO `categories` VALUES (:id, :name)', {
            id: this.id,
            name:this.name.toUpperCase(),
        })
        return this.id;
    }
    async deleteCategory(id:string): Promise<void> {
        await pool.execute('DELETE FROM `categories` WHERE `id`=:id', {
            id:this.id
        })
    }
    async updateCategory(name: string): Promise<void> {
        await pool.execute('UPDATE `categories` SET `name`=:name WHERE `id`= :id', {
            id:this.id,
            name
         });
    };
    static async getOneCategory(id: string): Promise<CategoryRecord> {
        const [results] = await pool.execute('SELECT * FROM `categories` WHERE `id`= :id', {
            id
        }) as CategoryRecordResult;
        return results.length === 0 ? null : new CategoryRecord(results[0]);
    }

    static async getListOfCategories(): Promise<CategoryRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `categories`') as CategoryRecordResult;
        return results.map(obj => new CategoryRecord(obj))
    }
}
