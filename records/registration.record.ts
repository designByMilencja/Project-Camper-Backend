import {RegistrationEntity} from "../types/registration.entity";
import {ValidationError} from "../utils/errors";

export class RegistrationRecord implements RegistrationEntity {
    userId: string;
    name: string;
    email: string;
    login: string;
    password: string;

    constructor(obj: RegistrationEntity) {
        const {userId, name, email, login, password} = obj;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.login = login;
        this.password = password;

        if (!name || name === '') {
            throw new ValidationError('Wpisz imię, aby się zalogować.');
        }
        if (name.length > 50 || name.length < 5) {
            throw new ValidationError('Imię musi zawierać od 3 do 50 znaków.');
        }
        if (!email || email === '') {
            throw new ValidationError('Wpisz email, aby się zalogować.');
        }
        if (email.length > 50 || email.length < 5) {
            throw new ValidationError('Email musi zawierać od 5 do 50 znaków.');
        }
        if (!email.includes('@')) {
            throw new ValidationError('Email musi zawierać znak "@".');
        }
        if (!login || login === '') {
            throw new ValidationError('Wpisz login lub e-mail, aby się zalogować.');
        }
        if (login.length > 50 || login.length < 5) {
            throw new ValidationError('Login lub e-mail, musi zawierać od 5 do 30 znaków.');
        }
        if (!password || password === '') {
            throw new ValidationError('Wpisz hasło, aby się zalogować.');
        }
        if (password.length > 25 || password.length < 8) {
            throw new ValidationError('Hasło musi zawierać od 8 do 25 znaków.');
        }
    }
}
