import {PaymentEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";

type PaymentRecordResult = [PaymentEntity[], FieldPacket[]];

export class PaymentRecord implements PaymentEntity {
    id: string;
    cost: number;
    currency: string;
    boughtAt: string;
    idCategory: string;
    idPlace: string;

    constructor(obj: PaymentEntity) {
        const {id, cost, currency, boughtAt, idCategory, idPlace} = obj;
        this.id = id;
        this.cost = cost;
        this.currency = currency;
        this.boughtAt = boughtAt;
        this.idCategory = idCategory;
        this.idPlace = idPlace;

        if (!cost || cost === 0) {
            throw new ValidationError('Musisz podać koszt , aby dodać Twoją płatność')
        }
        if (cost > 999999.99) {
            throw new ValidationError('Płatność nie może być wyższa niż milion złotych')
        }
        if (!currency || currency === '') {
            throw new ValidationError('Wybierz walutę, w której została dokonana płatność.')
        }
        if (!boughtAt || boughtAt === '') {
            throw new ValidationError('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
        }
        if (boughtAt > new Date().toDateString()) {
            throw new ValidationError('Nie możesz wybrać daty z przyszłości')
        }
        if (!idCategory || idCategory === '') {
            throw new ValidationError('Musisz wybrać nazwę kategorii Twojej płatności')
        }
        if (!idPlace || idPlace === '') {
            throw new ValidationError('Musisz wybrać miejsce, w zrealizowania płatności')
        }
    }


    async insertPayment(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert sth that is already added!');
        }
        await pool.execute('INSERT INTO `payments` VALUES (:id, :cost, :currency, :boughtAt, :idPlace, :idCategory)', {
            id: this.id,
            cost: this.cost,
            currency: this.currency,
            boughtAt: this.boughtAt,
            idPlace: this.idPlace,
            idCategory: this.idCategory,
        })
        return this.id;
    };

    static async getOnePayment(id: string): Promise<PaymentEntity> {
        const [results] = await pool.execute('SELECT * FROM `payments` WHERE `id`= :id', {
            id,
        }) as PaymentRecordResult;
        return results.length === 0 ? null : new PaymentRecord(results[0]);
    }

    static async getAllPayments(): Promise<PaymentEntity[]> {
        const [results] = await pool.execute('SELECT * FROM `payments`') as PaymentRecordResult;
        return results.map(obj=> new PaymentRecord(obj))
    }
    static async sumPaymentsAtOneCategory(idCategory:string) {
        const [results] = await pool.execute('SELECT SUM(`cost`) FROM `payments` WHERE `idCategory`= :idCategory', {
            idCategory
        }) as PaymentRecordResult;
        return results.length === 0 ? null : new PaymentRecord(results[0]);
    }
    //
    // static async getOneCategoryAtOnePlace(idCategory: string, idPlace: string): Promise<PaymentEntity | null> {
    //     const [results] = (await pool.execute('SELECT * FROM `payments` WHERE `idCategory` = :idCategory AND `idPlace`= :idPlace', {
    //         idCategory,
    //         idPlace
    //     })) as PaymentRecordResult;
    //     return results.length === 0 ? null : new PaymentRecord(results[0]);
    // }

    // static async getAllCategoryAtOnePlace(idPlace: string): Promise<PaymentEntity[] | null> {
    //     const [results] = await pool.execute('SELECT * FROM `payments` WHERE `idPlace` = :idPlace', {
    //         idPlace,
    //     }) as PaymentRecordResult;
    //     return results.map(result => {
    //         const {cost, idPlace, currency, idCategory, id, boughtAt} = result;
    //         return {
    //             cost,
    //             idPlace, currency, idCategory, id, boughtAt
    //         }
    //     })
    // }
    //
    // static async getOneCategoryAtMonth(month: number, idCategory: string): Promise<PaymentEntity | null> {
    //     const [results] = (await pool.execute('SELECT SUM(`cost`) FROM `payments` WHERE `idCategory` = :idCategory AND MONTH(`boughtAt`)=:month', {
    //         month,
    //         idCategory,
    //     })) as PaymentRecordResult;
    //     return results.length === 0 ? null : new PaymentRecord(results[0]);
    // }
    //
    // static async getAllCategoryAtMonth(month: number): Promise<PaymentEntity | null> {
    //     const [results] = (await pool.execute('SELECT SUM(`cost`) FROM `payments` WHERE  MONTH(`boughtAt`)=:month', {
    //         month,
    //     })) as PaymentRecordResult;
    //     return results.length === 0 ? null : new PaymentRecord(results[0]);
    // }
    //
    // static async getOneCategoryAtYear(year: number, idCategory: string): Promise<PaymentEntity | null> {
    //     const [results] = (await pool.execute('SELECT SUM(`cost`) FROM `payments` WHERE `idCategory` = :idCategory AND YEAR(`boughtAt`)=:year', {
    //         year,
    //         idCategory,
    //     })) as PaymentRecordResult;
    //     return results.length === 0 ? null : new PaymentRecord(results[0]);
    // }
    //
    // static async getAllCategoryAtYear(year: number): Promise<PaymentEntity | null> {
    //     const [results] = (await pool.execute('SELECT SUM(`cost`) FROM `payments` WHERE YEAR(`boughtAt`)=:year', {
    //         year,
    //     })) as PaymentRecordResult;
    //     return results.length === 0 ? null : new PaymentRecord(results[0]);
    // }
}
