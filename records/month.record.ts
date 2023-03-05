import {MonthEntity} from "../types/month.entity";
import {FieldPacket} from "mysql2";
import {pool} from "../utils/db";

type MonthRecordResult = [MonthEntity[], FieldPacket[]];

export class MonthRecord implements MonthEntity {
    id: string;
    name: string;
    year: number;
    sumPayments: number;

    constructor(obj: MonthEntity) {
        const {id, name, sumPayments, year} = obj;
    }

    static async getOneMonth(name: string): Promise<MonthEntity | null> {
        const [results] = (await pool.execute('SELECT * FROM `months` WHERE `name` = :name', {
            name,
        })) as MonthRecordResult;
        return results.length === 0 ? null : new MonthRecord(results[0]);
    }
}
