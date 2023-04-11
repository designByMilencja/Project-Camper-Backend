import {CategoryRecord} from "../records/category.record";
import {CategoryEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";

afterAll(async ()=> {
    await pool.end();
});
const validValue: CategoryEntity = {
    name: 'owoce',
};
const emptyValue: CategoryEntity = {
    name: '',
};
const tooLongValue: CategoryEntity = {
    name: 'a'.repeat(58)
};
const tooShortValue: CategoryEntity = {
    name: 'iks'
};
test('CategoryRecord sets object properties correctly?', () => {
    const category = new CategoryRecord(validValue);
    expect(category.name).toBe('owoce');
});
test('CategoryRecord throws ValidationError for empty category name', () => {
    expect(() => new CategoryRecord(emptyValue)).toThrow(ValidationError);
});
test('CategoryRecord throws ValidationError for category name longer than 57 characters', () => {
    expect(() => new CategoryRecord(tooLongValue)).toThrow(ValidationError);
});
test('CategoryRecord throws ValidationError for category name shorter than 4 characters', () => {
    expect(() => new CategoryRecord(tooShortValue)).toThrow(ValidationError);
});
test('getOneCategory returns null for invalid id', async () => {
    const category = await CategoryRecord.getOneCategory('invalid-id');
    expect(category).toBeNull();
});
test('getOneCategory returns CategoryRecord object for valid id', async () => {
    const category = new CategoryRecord(validValue);
    await category.insertCategory();
    const result = await CategoryRecord.getOneCategory(category.id);
    expect(result).toBeInstanceOf(CategoryRecord);
});
test('getListOfCategories returns array of CategoryRecord objects', async () => {
    const categories = await CategoryRecord.getListOfCategories();
    expect(categories).toBeInstanceOf(Array);
    expect(categories[0]).toBeInstanceOf(CategoryRecord);
});
test('No inserted CategoryRecord should has no id', async() => {
    const category = new CategoryRecord(validValue);
    expect(category.id).toBeUndefined();
});
test('CategoryRecord.insertCategory inserts data to database and category has id-uuid', async () => {
    const category = new CategoryRecord(validValue);
    await category.insertCategory();
    expect(category.id).toBeDefined();
    expect(category.id).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
});

