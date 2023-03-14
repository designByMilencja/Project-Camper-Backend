import {PlaceRecord} from "../records/place.record";

const defaultObj = {
    name: 'Rosja',
    currency: 'RUB',
}
test('Can create PlaceRecord?', () => {
    const place = new PlaceRecord(defaultObj);
    expect(place.name).toBe('Teneryfa');
    expect(place.currency).toBe('EUR');
})
test('Validates invalid name', () => {
    expect(() => new PlaceRecord({
        ...defaultObj,
        name: '',
    })).toThrow('Wpisz nazwę miejsca, które chcesz dodać.');
});
test('Validates invalid currency', () => {
    expect(() => new PlaceRecord({
        ...defaultObj,
        currency: '',
    })).toThrow('Wybierz walutę, która obowiązuje w wybranym miejscu.');
});
test('PlaceRecord.insertPlace inserts data to database ', async () => {
    const place = new PlaceRecord(defaultObj);
    await place.insertPlace();
    console.log(place)
})
