import {PaymentRecord} from "../records/payment.record";
import {PaymentEntity} from "../types";
import {pool} from "../utils/config.db";

afterAll(async () => {
    await pool.end();
});
const validValues: PaymentEntity = {
    cost: 2,
    currency: 'PLN',
    boughtAt: '2023-04-04',
    idCountry: '6be7fae0-557f-4c35-bb86-3de582464a9d',
    idCategory: '108efdd2-50e8-40d4-8606-886b57460fa1',
};
test('PaymentRecord constructor sets object properties correctly', () => {
    const payment = new PaymentRecord(validValues);
    expect(payment.cost).toBe(2);
    expect(payment.currency).toBe('PLN');
    expect(payment.boughtAt).toBe('2023-01-02');
    expect(payment.idCountry).toBe('654ded5e-bcd7-11ed-8ec8-7e1d1a287df9');
    expect(payment.idCategory).toBe('afcd9db6-bcd7-11ed-8ec8-7e1d1a287df9');
});
test('Validates invalid cost', () => {
    expect(() => new PaymentRecord({
        ...validValues,
        cost: 0
    })).toThrow('Musisz podać koszt , aby dodać Twoją płatność')
});
test('Validates invalid currency', () => {
    expect(() => new PaymentRecord({
        ...validValues,
        currency: ''
    })).toThrow('Wybierz walutę, w której została dokonana płatność.')
});
test('Validates invalid date', () => {
    expect(() => new PaymentRecord({
        ...validValues,
        boughtAt: ''
    })).toThrow('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
});
test('Validates invalid idCategory', () => {
    expect(() => new PaymentRecord({
        ...validValues,
        idCategory: ''
    })).toThrow('Musisz wybrać nazwę kategorii Twojej płatności')
});
test('Validates invalid idCountry', () => {
    expect(() => new PaymentRecord({
        ...validValues,
        idCountry: ''
    })).toThrow('Musisz wybrać miejsce, w celu zrealizowania płatności')
});
test('No inserted PaymentRecord should has no id', async () => {
    const payment = new PaymentRecord(validValues);
    expect(payment.id).toBeUndefined();
});
test('PaymentRecord.insertPayment inserts data to database and payment has id', async () => {
    const payment = new PaymentRecord(validValues);
    await payment.insertPayment();
    expect(payment.id).toBeDefined();
    expect(payment.id).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)
    const paymentExist = await PaymentRecord.getOnePayment(payment.id)
    expect(paymentExist).toBeTruthy()
});
test('PaymentRecord.deletePayment inserts data in database ', async () => {
    const payment = new PaymentRecord(validValues);
    await payment.insertPayment();
    await payment.deletePayment(payment.id)
    const paymentExist = await PaymentRecord.getOnePayment(payment.id)
    expect(paymentExist).toBeFalsy();
});
test('PaymentRecord.updatePayment update data in database and payment has id-uuid', async () => {
    const payment = new PaymentRecord(validValues);
    await payment.insertPayment();
    const newValues = {
        ...validValues,
        cost: 100,
    };
    await payment.updatePayment(newValues);
    const updatePayment = await PaymentRecord.getOnePayment(payment.id)
    expect(updatePayment.cost).toBe(100);
    expect(updatePayment.id).toBe(payment.id);
});
test('function sumAllCategoriesInOneYear should sum ')

