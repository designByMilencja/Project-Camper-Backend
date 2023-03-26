import {CountryEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {currencySymbols} from "../utils/currencySymbols";
type CountryRecordResult = [CountryEntity[], FieldPacket[]];

export class CountryRecord implements CountryEntity {
    id: string;
    name: string;
    currency: string;

    constructor(obj: CountryEntity) {
        const {id, name, currency} = obj;
        this.id = id;
        this.name = name;
        this.currency = currency;
        if (!name || name === '') {
            throw new ValidationError('Wpisz nazwę kraju, który chcesz dodać.')
        }
        if (name.length > 60) {
            throw new ValidationError('Nazwa kraju, nie może przekraczać 60 znaków.')
        }
        if (name.length < 5) {
            throw new ValidationError('Nazwa kraju, nie może być krótsza niż 5 znaków.')
        }
        if (!currency || currency === '') {
            throw new ValidationError('Wybierz walutę, która obowiązuje w wybranym kraju.')
        }
    }

    async insertCountry(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert sth that is already added!');
        }
        const availableCurrency = await currencySymbols();
        if (typeof this.currency === "undefined" || !availableCurrency.includes(this.currency.toUpperCase())) {
            console.log(this.currency)
            throw new Error('Przepraszamy nie dysponujemy przelicznikiem dla tej waluty, proponujemy wpisanie USD lub EUR')
        }
        await pool.execute('INSERT INTO `countries` VALUES (:id, :name, :currency)', {
            id:this.id,
            name:this.name.toUpperCase(),
            currency:this.currency.toUpperCase(),
        });
        return this.id;
    }
    async deleteCountry(id:string): Promise<void> {
        await pool.execute('DELETE FROM `countries` WHERE `id`=:id', {
            id:this.id
        })
    }
    async updateCountry(name: string, currency:string): Promise<void> {
        await pool.execute('UPDATE `countries` SET `name`=:name, `currency`=:currency WHERE `id`= :id', {
            id:this.id,
            name,
            currency,
        });
    };

    static async getOneCountry(id: string): Promise<CountryEntity> {
        const [results] = await pool.execute('SELECT * FROM `countries` WHERE `id`= :id', {
            id,
        }) as CountryRecordResult;
        return results.length === 0 ? null : new CountryRecord(results[0]);
    }

    static async getListOfCountries(): Promise<CountryEntity[]> {
        const [results] = await pool.execute('SELECT * FROM `countries`') as CountryRecordResult;
        return results.map(obj => new CountryRecord(obj));
    }


}