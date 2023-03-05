import {AddPaymentRecord} from "../records/add-payment.record";

const defaultObj = {
    cost: 4,
    boughtAt: '2022-02-01',
    catSymbol: '1',
}
test('Can create AddPaymentRecord?', ()=>{
    const payment = new AddPaymentRecord(defaultObj);
    expect(payment.name).toBe("serwis");
    expect(payment.cost).toBe(4);
    expect(payment.createdAt).toBe('2022-02-01');
});
test('Validates invalid name', ()=>{
    expect(()=> new AddPaymentRecord({
        ...defaultObj,
        catSymbol: '',
    })).toThrow('Musisz wybrać nazwę kategorii Twojej płatności')
});
test('Validates invalid cost', ()=>{
    expect(()=> new AddPaymentRecord({
        ...defaultObj,
        cost: 0,
    })).toThrow('Musisz podać koszt , aby dodać Twoją płatność')
});
test('Validates invalid date', ()=>{
    expect(()=> new AddPaymentRecord({
        ...defaultObj,
        boughtAt: '',
    })).toThrow('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
});
