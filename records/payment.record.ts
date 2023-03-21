import {PaymentEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";
import {currencyConverterToPLN} from "../utils/converter";

type PaymentRecordResult = [PaymentEntity[], FieldPacket[]];

export class PaymentRecord implements PaymentEntity {
    id: string;
    cost: number;
    currency: string;
    boughtAt: string;
    idCategory: string;
    idCountry: string;
    sumOneCategory: number;
    sumOneCategoryInOneCountry: number;
    sumAllCategoriesInOneCountry: number;
    sumOneCategoryInOneMonth: number;
    sumAllCategoriesInOneMonth: number;
    sumInYear: number;

    constructor(obj: PaymentEntity) {
        const {
            id,
            cost,
            currency,
            boughtAt,
            idCategory,
            idCountry,
            sumOneCategory,
            sumOneCategoryInOneCountry,
            sumAllCategoriesInOneCountry,
            sumOneCategoryInOneMonth,
            sumAllCategoriesInOneMonth,
            sumInYear,
        } = obj;
        this.id = id;
        this.cost = cost;
        this.currency = currency;
        this.boughtAt = boughtAt;
        this.idCategory = idCategory;
        this.idCountry = idCountry;
        this.sumOneCategory = sumOneCategory;
        this.sumOneCategoryInOneCountry = sumOneCategoryInOneCountry;
        this.sumAllCategoriesInOneCountry = sumAllCategoriesInOneCountry;
        this.sumOneCategoryInOneMonth = sumOneCategoryInOneMonth;
        this.sumAllCategoriesInOneMonth = sumAllCategoriesInOneMonth;
        this.sumInYear = sumInYear;

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
        if (!idCountry || idCountry === '') {
            throw new ValidationError('Musisz wybrać miejsce, w celu zrealizowania płatności')
        }
    }

    async insertPayment(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert sth that is already added!');
        }
        if(this.currency !== 'PLN') {
           const averageRate = await currencyConverterToPLN(this.currency, this.boughtAt);
           this.cost = this.cost * averageRate;
           this.currency = 'PLN'
           if(isNaN(this.cost)) {
               throw new ValidationError("Przykro mi ale podana waluta jest błędna, wprowadź poprawna walute lub koszt przeliczony na PLN")
           }
        }
        await pool.execute('INSERT INTO `payments` VALUES (:id, :cost, :currency, :boughtAt, :idCountry, :idCategory)',
            {
                id: this.id,
                cost: this.cost,
                currency: this.currency,
                boughtAt: this.boughtAt,
                idCountry: this.idCountry,
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
    static async getListOfPayments(): Promise<PaymentEntity[]> {
        const [results] = await pool.execute('SELECT * FROM `payments`') as PaymentRecordResult;
        return results.map(obj => new PaymentRecord(obj))
    }
    static async sumOneCategory(idCategory: string): Promise<number> {
        const [[{sumOneCategory}]] = await pool.execute('SELECT SUM(`cost`) AS `sumOneCategory` FROM `payments` WHERE `idCategory`= :idCategory',
            {
                idCategory,
            }) as PaymentRecordResult;
        return sumOneCategory
    }

    static async sumOneCategoryInOneCountry(idCategory: string, idPlace: string): Promise<number> {
        const [[{sumOneCategoryInOneCountry}]] = await pool.execute('SELECT SUM(`cost`) AS `sumOneCategoryInOneCountry` FROM `payments` WHERE `idCategory`= :idCategory AND `idPlace`= :idPlace', {
            idCategory,
            idPlace,
        }) as PaymentRecordResult;
        return sumOneCategoryInOneCountry
    }

    static async sumAllCategoriesInOneCountry(idPlace: string): Promise<number> {
        const [[{sumAllCategoriesInOneCountry}]] = await pool.execute('SELECT SUM(`cost`) AS `sumAllCategoriesInOneCountry` FROM `payments` WHERE `idPlace`= :idPlace', {
            idPlace
        }) as PaymentRecordResult;
        return sumAllCategoriesInOneCountry
    }

    static async sumOneCategoryInOneMonth(idCategory: string, month: number): Promise<number> {
        const [[{sumOneCategoryInOneMonth}]] = await pool.execute(
            'SELECT SUM(`cost`) AS `sumOneCategoryInOneMonth` FROM `payments` WHERE `idCategory`= :idCategory AND MONTH(`boughtAt`)= :month',
            {
                idCategory,
                month
            }) as PaymentRecordResult;
        return sumOneCategoryInOneMonth
    }

    static async sumAllCategoriesInOneMonth(month: number): Promise<number> {
        const [[{sumAllCategoriesInOneMonth}]] = await pool.execute('SELECT SUM(`cost`) AS `sumAllCategoriesInOneMonth` FROM `payments` WHERE MONTH(`boughtAt`)= :month',
            {
                month
            }) as PaymentRecordResult;
        return sumAllCategoriesInOneMonth
    }

    static async sumAllCategoriesInOneYear(year: number): Promise<number> {
        const [[{sumInYear}]] = await pool.execute('SELECT SUM(`cost`) AS `sumInYear` FROM `payments` WHERE YEAR(`boughtAt`)=:year', {
            year,
        }) as PaymentRecordResult;
        return sumInYear
    }
}
