import {PaymentRecord} from "../records/payment.record";
import {PaymentEntity} from "../types";

const defaultObj: { sumOneCategoryInOneCountry: number; cost: number; sumAllCategoriesInOneCountry: number; boughtAt: string; sumInYear: number; sumAllCategoriesInOneMonth: number; currency: string; sumOneCategory: number; idCountry: string; idCategory: string; sumOneCategoryInOneMonth: number } = {
    cost: 2,
    currency: 'PLN',
    boughtAt: '2023-01-02',
    idCountry: '654ded5e-bcd7-11ed-8ec8-7e1d1a287df9',
    idCategory: 'afcd9db6-bcd7-11ed-8ec8-7e1d1a287df9',
    sumAllCategoriesInOneCountry: 0,
    sumAllCategoriesInOneMonth: 0,
    sumInYear: 0,
    sumOneCategory: 0,
    sumOneCategoryInOneCountry: 0,
    sumOneCategoryInOneMonth: 0,
}
test('Can create PaymentRecord?', () => {
    const payment = new PaymentRecord(<PaymentEntity>defaultObj);
    expect(payment.cost).toBe(2);
    expect(payment.currency).toBe('PLN');
    expect(payment.boughtAt).toBe('2023-01-02');
    expect(payment.idCountry).toBe('654ded5e-bcd7-11ed-8ec8-7e1d1a287df9');
    expect(payment.idCategory).toBe('afcd9db6-bcd7-11ed-8ec8-7e1d1a287df9');
});

test('Validates invalid cost', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        cost: 0
    })).toThrow('Musisz podać koszt , aby dodać Twoją płatność')
});

test('Validates invalid currency', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        currency: ''
    })).toThrow('Wybierz walutę, w której została dokonana płatność.')
});
test('Validates invalid date', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        boughtAt: ''
    })).toThrow('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
});

test('Validates invalid idCategory', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        idCategory: ''
    })).toThrow('Musisz wybrać nazwę kategorii Twojej płatności')
});
test('Validates invalid idCountry', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        idCountry: ''
    })).toThrow('Musisz wybrać miejsce, w celu zrealizowania płatności')
});


