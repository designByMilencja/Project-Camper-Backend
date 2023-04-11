import {CountryRecord} from "../records/country.record";
import {CountryEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";

afterAll(async () => {
    await pool.end();
});
const validValue: CountryEntity = {
    name: 'Malta',
    currency: 'EUR',
};
test('CountryRecord constructor sets object properties correctly?', () => {
    const country = new CountryRecord(validValue);
    expect(country.name).toBe('Malta');
    expect(country.currency).toBe('EUR');
});
test('Validates empty name', () => {
    expect(() => new CountryRecord({
        ...validValue,
        name: ''
    })).toThrow('Wpisz nazwę kraju, który chcesz dodać.');
});
test('Validates too long name', () => {
    expect(() => new CountryRecord({
        ...validValue,
        name: 'a'.repeat(61)
    })).toThrow('Nazwa kraju, nie może przekraczać 60 znaków.');
});
test('Validates too short name', () => {
    expect(() => new CountryRecord({
        ...validValue,
        name: 'aa'
    })).toThrow('Nazwa kraju, nie może być krótsza niż 5 znaków.');
});
test('Validates empty currency', () => {
    expect(() => new CountryRecord({
        ...validValue,
        currency: ''
    })).toThrow('Wybierz walutę, która obowiązuje w wybranym kraju.');
});
test('Should throw a ValidationError if the country already exists in the database', async () => {
    const country = new CountryRecord({
        id: 'f07d72b4-6059-4b69-94f7-e9855e50104e',
        name: 'POLSKA',
        currency: 'PLN'
    });
    await expect(country.insertCountry()).rejects.toThrowError(ValidationError);
});
test('getOneCountry returns CountryRecord object for valid id', async () => {
    const country = new CountryRecord(validValue);
    await country.insertCountry();
    const result = await CountryRecord.getOneCountry(country.id);
    expect(result).toBeInstanceOf(CountryRecord);
});
test('getListOfCountries returns array of CountryRecord objects', async () => {
    const countries = await CountryRecord.getListOfCountries();
    expect(countries).toBeInstanceOf(Array);
    expect(countries[0]).toBeInstanceOf(CountryRecord);
});
test('No inserted CountryRecord should has no id', async () => {
    const country = new CountryRecord(validValue);
    expect(country.id).toBeUndefined();
})
test('CountryRecord.insertCountry inserts data to database and country has id-uuid ', async () => {
    const country = new CountryRecord(validValue);
    await country.insertCountry();
    expect(country.id).toBeDefined()
    expect(country.id).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
});
