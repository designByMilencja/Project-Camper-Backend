import {AddPlaceRecord} from "../records/add-place.record";

const defaultObj = {
    name: 'Polska',
    currency: 'PLN',
    createdAt: '2023-03-01',
}
test('Can cretate AddPlaceRecord?', () => {
    const place = new AddPlaceRecord(defaultObj);
    expect(place.name).toBe('Polska');
    expect(place.currency).toBe('PLN');
    expect(place.createdAt).toBe('2023-03-01');
})
test('Validates invalid name', () => {
    expect(()=> new AddPlaceRecord({
        ...defaultObj,
        name: '',
    })).toThrow('Wpisz nazwę miejsca, które chcesz dodać.');
});
test('Validates invalid currency', () => {
    expect(()=> new AddPlaceRecord({
        ...defaultObj,
        currency: '',
    })).toThrow('Wybierz walutę, która obowiązuje w wybranym miejscu.');
});
test('Validates invalid date', () => {
    expect(()=> new AddPlaceRecord({
        ...defaultObj,
        createdAt: '',
    })).toThrow('Wybierz datę, od kiedy jesteś w tym miejscu.');
});
