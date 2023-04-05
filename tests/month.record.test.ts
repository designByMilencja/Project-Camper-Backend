import {MonthRecord} from "../records/month.record";
import {MonthEntity} from "../types";
import {pool} from "../utils/db";

afterAll(async () => {
    await pool.end();
});
const defaultObj: MonthEntity = {
    id: '1',
    name: 'January',
    number: 1,
};
test('MonthRecord constructor sets object properties correctly', () => {
    const month = new MonthRecord(defaultObj);
    expect(month.id).toBe('1');
    expect(month.name).toBe('January');
    expect(month.number).toBe(1);
});
test('getOneMonth returns null for an invalid id', async () => {
    const month = await MonthRecord.getOneMonth('invalid-id');
    expect(month).toBeNull();
});
test('getOneMonth returns a MonthRecord object for a valid id', async () => {
    const month = await MonthRecord.getOneMonth('a9158406-c7dc-11ed-9d3d-9a1ec5823eae');
    expect(month).toBeInstanceOf(MonthRecord);
});
test('getListOfMonths returns an array of MonthRecord objects', async () => {
    const months = await MonthRecord.getListOfMonths();
    expect(months).toBeInstanceOf(Array);
    expect(months[0]).toBeInstanceOf(MonthRecord);
});
test('getListOfMonths returns exactly 12 MonthRecord objects', async () => {
    const months = await MonthRecord.getListOfMonths();
    expect(months.length).toBe(12);
});

test('getListOfMonthsNumbers returns an array of month numbers', async () => {
    const numbers = await MonthRecord.getListOfMonthsNumbers();
    expect(numbers).toBeInstanceOf(Array);
    expect(numbers[0]).toEqual(expect.any(Number));
});


