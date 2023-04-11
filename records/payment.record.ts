import {PaymentEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/config.db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";
import {convertToPLN} from "../utils/convertToPLN";

type PaymentRecordResult = [PaymentEntity[], FieldPacket[]];

export class PaymentRecord implements PaymentEntity {
    id: string;
    cost: number;
    currency: string;
    boughtAt: string;
    idCountry: string;
    idCategory: string;
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
            idCountry,
            idCategory,
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
        this.idCountry = idCountry;
        this.idCategory = idCategory;
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
            throw new ValidationError('Cannot insert sth that is already added!');
        }
        if (this.currency !== 'PLN') {
            let averageRate = await convertToPLN(this.currency, this.boughtAt);
            if (averageRate === undefined) {
                try {
                    const url = `https://api.nbp.pl/api/exchangerates/rates/A/${this.currency}/2023-01-01/${this.boughtAt}`
                    const res = await fetch(url);
                    const {rates} = await res.json();
                    const exchangeRate = rates[0].mid;
                    averageRate = exchangeRate.toFixed(2);
                } catch (err) {
                    console.error(err)
                }
            }
            this.cost = this.cost * averageRate;
            this.currency = 'PLN';
            if (isNaN(this.cost)) {
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

    async deletePayment(id: string): Promise<void> {
        await pool.execute('DELETE FROM `payments` WHERE `id`=:id', {
            id,
        })
    }

    async updatePayment(paymentData:PaymentEntity): Promise<void> {
        const {cost, currency, boughtAt, idCountry, idCategory} = paymentData;
        await pool.execute('UPDATE `payments` SET `cost`=:cost, `currency`=:currency, `boughtAt`= :boughtAt, `idCountry`=:idCountry, `idCategory` = :idCategory  WHERE `id`= :id', {
            id: this.id,
            cost,
            currency,
            boughtAt,
            idCountry,
            idCategory,
        });
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

    static async sumOneCategoryInOneCountry(idCategory: string, idCountry: string): Promise<number> {
        const [[{sumOneCategoryInOneCountry}]] = await pool.execute('SELECT SUM(`cost`) AS `sumOneCategoryInOneCountry` FROM `payments` WHERE `idCategory`= :idCategory AND `idCountry`= :idCountry', {
            idCategory,
            idCountry,
        }) as PaymentRecordResult;
        return sumOneCategoryInOneCountry
    }

    static async sumAllCategoriesInOneCountry(idCountry: string): Promise<number> {
        const [[{sumAllCategoriesInOneCountry}]] = await pool.execute('SELECT SUM(`cost`) AS `sumAllCategoriesInOneCountry` FROM `payments` WHERE `idCountry`= :idCountry', {
            idCountry
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
