import {CategoryRecord} from "../records/category.record";
const defaultObj = {
    name: 'owoce',
}

test('Can create CategoryRecord?', () => {
    const category = new CategoryRecord(defaultObj);
    expect(category.name).toBe('owoce');
});
test('Validates invalid name', () => {
    expect(() => new CategoryRecord({
        ...defaultObj,
        name: '',
    })).toThrow('Wpisz nazwę kategorii, którą chcesz dodać.');
});
test('CategoryRecord.insertCategory inserts data to database ', async () => {
    const category = new CategoryRecord(defaultObj);
    await category.insertCategory();
    console.log(category)
})

