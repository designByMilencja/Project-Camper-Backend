import {AddPlaceRecord} from "../records/add-place.record";

const defaultObj = {
    name: 'Teneryfa',
    currency: 'EUR',
}
test('Can create AddPlaceRecord?', () => {
    const place = new AddPlaceRecord(defaultObj);
    expect(place.name).toBe('Teneryfa');
    expect(place.currency).toBe('EUR');
})
test('Validates invalid name', () => {
    expect(() => new AddPlaceRecord({
        ...defaultObj,
        name: '',
    })).toThrow('Wpisz nazwę miejsca, które chcesz dodać.');
});
test('Validates invalid currency', () => {
    expect(() => new AddPlaceRecord({
        ...defaultObj,
        currency: '',
    })).toThrow('Wybierz walutę, która obowiązuje w wybranym miejscu.');
});

