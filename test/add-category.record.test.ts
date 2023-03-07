import {AddCategoryRecord} from "../records/add-category.record";

const defaultObj = {
    name: 'serwis',
}

test('Can create AddCategoryRecord?', () => {
    const category = new AddCategoryRecord(defaultObj);
    expect(category.name).toBe('serwis');
});
test('Validates invalid name', () => {
    expect(() => new AddCategoryRecord({
        ...defaultObj,
        name: '',
    })).toThrow('Wpisz nazwę kategorii, którą chcesz dodać.');
});

