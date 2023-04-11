import {RegistrationEntity} from "../types";
import {RegistrationRecord} from "../records/registration.record";
import {pool} from "../utils/db";

afterAll(async () => {
    await pool.end();
});
const validValues: RegistrationEntity = {
    emailVerified: false,
    verificationCode: "",
    name: 'Test',
    email: "test@gmail.com",
    login: "testowa",
    password: "test12367",
    id: "1"
};
test('RegistrationRecord constructor sets object properties correctly?', () => {
    const user = new RegistrationRecord(validValues);
    expect(user.name).toBe('Test');
    expect(user.email).toBe('test@gmail.com');
    expect(user.login).toBe('testowa');
    expect(user.password).toBe('test12367');
    expect(user.id).toBe('1');
});
test('constructor should throw a ValidationError with invalid data', () => {
    expect(() => new RegistrationRecord({...validValues, name: ''})).toThrowError('Wpisz imię, aby się zalogować.');
    expect(() => new RegistrationRecord({
        ...validValues,
        name: 'x'.repeat(51)
    })).toThrowError('Imię musi zawierać od 3 do 50 znaków.');
    expect(() => new RegistrationRecord({...validValues, email: ''})).toThrowError('Wpisz email, aby się zalogować.');
    expect(() => new RegistrationRecord({
        ...validValues,
        email: 'x'.repeat(51)
    })).toThrowError('Email musi zawierać od 5 do 50 znaków.');
    expect(() => new RegistrationRecord({
        ...validValues,
        email: 'aaaaa'
    })).toThrowError('Email musi zawierać znak "@".');
});
test('getUser returns user of RegistrationRecord objects', async () => {
    const user = await RegistrationRecord.getUser('acc95639-0a3a-4f59-930f-4fb358670e75');
    expect(user).toBeDefined();
});
test('getUser returns null for invalid id', async () => {
    const user = await RegistrationRecord.getUser('invalid-id');
    expect(user).toBeNull();
});
test('No inserted RegistrationRecord should has no id', async () => {
    const user = new RegistrationRecord(validValues);
    expect(user.id).toBeUndefined();
});
test('RegistrationRecord.insertNewUser inserts data to database and user has id-uuid ', async () => {
    const user = new RegistrationRecord({...validValues, id: ''});
    await user.insertNewUser();
    expect(user.id).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
});
