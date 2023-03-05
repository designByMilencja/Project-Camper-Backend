import {MonthRecord} from "../records/month.record";

test('MonthRecord returns data from database for one entry', async () => {
    const month = await MonthRecord.getOneMonth('Luty');
    expect(month).toBeDefined();
    // expect(month.name).toBe('Luty');
    expect(month.id)
})
