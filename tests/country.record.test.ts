// import {CountryRecord} from "../records/country.record";
//
// const defaultObj = {
//     name: 'Rosja',
//     currency: 'RUB',
// }
// test('Can create CountryRecord?', () => {
//     const place = new CountryRecord(defaultObj);
//     expect(place.name).toBe('Teneryfa');
//     expect(place.currency).toBe('EUR');
// })
// test('Validates invalid name', () => {
//     expect(() => new CountryRecord({
//         ...defaultObj,
//         name: '',
//     })).toThrow('Wpisz nazwę kraju, które chcesz dodać.');
// });
// test('Validates invalid currency', () => {
//     expect(() => new CountryRecord({
//         ...defaultObj,
//         currency: '',
//     })).toThrow('Wybierz walutę, która obowiązuje w wybranym kraju.');
// });
// test('CountryRecord.insertCountry inserts data to database ', async () => {
//     const country = new CountryRecord(defaultObj);
//     await country.insertCountry();
//     console.log(country)
// })
