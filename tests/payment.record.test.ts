import {PaymentRecord} from "../records/payment.record";

const defaultObj = {
    cost: 2,
    currency: 'PLN',
    boughtAt: '2023-01-02',
    idCategory: 'afcd9db6-bcd7-11ed-8ec8-7e1d1a287df9',
    idPlace: '654ded5e-bcd7-11ed-8ec8-7e1d1a287df9',
}
test('Can create PaymentRecord?', () => {
    const payment = new PaymentRecord(defaultObj);
    expect(payment.cost).toBe(200);
    expect(payment.currency).toBe('PLN');
    expect(payment.boughtAt).toBe('2023-01-02');
    expect(payment.idCategory).toBe('afcd9db6-bcd7-11ed-8ec8-7e1d1a287df9');
    expect(payment.idPlace).toBe('654ded5e-bcd7-11ed-8ec8-7e1d1a287df9');
});

test('Validates invalid cost', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        cost: 0,
    })).toThrow('Musisz podać koszt , aby dodać Twoją płatność')
});

test('Validates invalid currency', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        currency: '',
    })).toThrow('Wybierz walutę, w której została dokonana płatność.')
});
test('Validates invalid date', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        boughtAt: '',
    })).toThrow('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
});

test('Validates invalid idCategory', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        idCategory: '',
    })).toThrow('Musisz wybrać nazwę kategorii Twojej płatności')
});
test('Validates invalid idPlace', () => {
    expect(() => new PaymentRecord({
        ...defaultObj,
        idPlace: '',
    })).toThrow('Musisz wybrać miejsce, w zrealizowania płatności')
});
test('PaymentRecord.insertPayment returns new UUID ', async () => {
    const payment = new PaymentRecord(defaultObj);
    await payment.insertPayment();
    expect(payment.id).toBeDefined();
    expect(typeof payment.id).toBe('string');
});
test('PaymentRecord.insertPayment inserts data to database ', async () => {
    const payment = new PaymentRecord(defaultObj);
    await payment.insertPayment();
    console.log(payment);
})
// test('PaymentRecord.getOneCategoryAtOnePlace search category in database', async () => {
//     const foundPayment = await PaymentRecord.getOneCategoryAtYear(2022, '66d809b2-bd08-11ed-8ec8-7e1d1a287df9');
//     expect(foundPayment).toBeDefined();
//     console.log(foundPayment);
// });
// test('PaymentRecord.getAllCategoryAtOnePlace search category in database', async () => {
//     const foundPayment = await PaymentRecord.getAllCategoryAtOnePlace('d336e696-bd08-11ed-8ec8-7e1d1a287df9');
//     expect(foundPayment).toBeDefined();
//     console.log(foundPayment);
// })
