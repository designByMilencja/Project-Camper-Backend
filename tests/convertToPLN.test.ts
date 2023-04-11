import {convertToPLN} from "../utils/convertToPLN";
import {pool} from "../utils/config.db";

afterAll(async () => {
    await pool.end();
});
test('Converts USD to PLN for a given date', async () => {
    const result = await convertToPLN('USD', '2023-04-03');
    expect(Number(result)).toBe(4.32);
});
test('Handles incorrect currency code', async () => {
    await expect(convertToPLN('ABC', '2023-04-01')).rejects.toThrowError();
});
test('Handles incorrect date format', async () => {
    await expect(convertToPLN('USD', '20230401')).rejects.toThrowError();
});
test('Does not take too long to convert', async () => {
    const startTime = performance.now();
    await convertToPLN('USD', '2023-03-01');
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(1000);
});
test('function should return exchange rate for given currency code and date', async () => {
    const currencyCode = 'USD';
    const date = '2022-04-01';
    const expectedExchangeRate = '4.20';
    const exchangeRate = await convertToPLN(currencyCode, date);
    expect(exchangeRate).toBe(expectedExchangeRate);
});
test('function should return exchange rate rounded to 2 decimal places', async () => {
    const currencyCode = 'GBP';
    const date = '2022-04-01';
    const exchangeRate = await convertToPLN(currencyCode, date);
    expect(Number(exchangeRate)).toBeCloseTo(5.51)
});

