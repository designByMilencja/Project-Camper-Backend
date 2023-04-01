import {CountryRecord} from "../records/country.record";
import {CountryEntity} from "../types";

const defaultObj = {
    name: 'Rosja',
    currency: 'RUB',
}
test('Can create CountryRecord?', () => {
    const place = new CountryRecord(<CountryEntity>defaultObj);
    expect(place.name).toBe('Teneryfa');
    expect(place.currency).toBe('EUR');
})
test('Validates invalid name', () => {
    expect(() => new CountryRecord({
        deleteCountry(): Promise<void> {
            return Promise.resolve(undefined);
        }, updateCountry(): Promise<void> {
            return Promise.resolve(undefined);
        },
        ...defaultObj,
        name: ''
    })).toThrow('Wpisz nazwę kraju, który chcesz dodać.');
});
test('Validates invalid currency', () => {
    expect(() => new CountryRecord({
        deleteCountry(): Promise<void> {
            return Promise.resolve(undefined);
        }, updateCountry(): Promise<void> {
            return Promise.resolve(undefined);
        },
        ...defaultObj,
        currency: ''
    })).toThrow('Wybierz walutę, która obowiązuje w wybranym kraju.');
});
test('CountryRecord.insertCountry inserts data to database ', async () => {
    const country = new CountryRecord(<CountryEntity>defaultObj);
    await country.insertCountry();
    console.log(country)
})
