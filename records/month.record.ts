import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {MonthEntity} from "../types";

type MonthRecordResult = [MonthEntity[], FieldPacket[]];

export class MonthRecord implements MonthEntity {
    id: string;
    name: string;
    number: number;

    constructor(obj: MonthEntity) {
        const {id, name, number} = obj;
        this.id = id;
        this.name = name;
        this.number = number;
    }

    static async getOneMonth(id: string): Promise<MonthRecord | null> {
        const [results] = await pool.execute('SELECT `name` FROM `months` WHERE `id`= :id', {
            id
        }) as MonthRecordResult;
        return results.length === 0 ? null : new MonthRecord(results[0]);
    }

    static async getListOfMonths(): Promise<MonthRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `months`') as MonthRecordResult;
        return results.map(obj => new MonthRecord(obj))
    }
    static async getListOfMonthsNumbers(): Promise<number[]> {
        const [results] = await pool.execute('SELECT `number` FROM `months`') as MonthRecordResult;
        return results.map(obj => obj.number);
    }
}
