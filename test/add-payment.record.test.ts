import {AddPaymentRecord} from "../records/add-payment.record";

const defaultObj = {
    cost: 20,
    currency: 'PLN',
    boughtAt: '2023-01-02',
    idCategory: 'afcd9db6-bcd7-11ed-8ec8-7e1d1a287df9',
    idPlace: '654ded5e-bcd7-11ed-8ec8-7e1d1a287df9',
}
test('Can create AddPaymentRecord?', () => {
    const payment = new AddPaymentRecord(defaultObj);
    expect(payment.cost).toBe(20);
    expect(payment.currency).toBe('PLN');
    expect(payment.boughtAt).toBe('2023-01-02');
    expect(payment.idCategory).toBe('afcd9db6-bcd7-11ed-8ec8-7e1d1a287df9');
    expect(payment.idPlace).toBe('654ded5e-bcd7-11ed-8ec8-7e1d1a287df9');
});

test('Validates invalid cost', () => {
    expect(() => new AddPaymentRecord({
        ...defaultObj,
        cost: 0,
    })).toThrow('Musisz podać koszt , aby dodać Twoją płatność')
});

test('Validates invalid currency', () => {
    expect(() => new AddPaymentRecord({
        ...defaultObj,
        currency: '',
    })).toThrow('Wybierz walutę, w której została dokonana płatność.')
});
test('Validates invalid date', () => {
    expect(() => new AddPaymentRecord({
        ...defaultObj,
        boughtAt: '',
    })).toThrow('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
});

test('Validates invalid idCategory', () => {
    expect(() => new AddPaymentRecord({
        ...defaultObj,
        idCategory: '',
    })).toThrow('Musisz wybrać nazwę kategorii Twojej płatności')
});
test('Validates invalid idPlace', () => {
    expect(() => new AddPaymentRecord({
        ...defaultObj,
        idPlace: '',
    })).toThrow('Musisz wybrać miejsce, w zrealizowania płatności')
});
