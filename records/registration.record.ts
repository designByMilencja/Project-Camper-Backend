import {RegistrationEntity} from "../types/registration.entity";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
type RegistrationRecordResult = [RegistrationEntity[], FieldPacket[]];
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
        if (name.length > 50 || name.length < 3) {
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
        if (login.length > 40 || login.length < 5) {
            throw new ValidationError('Login lub e-mail, musi zawierać od 5 do 40 znaków.');
        }
        if (!password || password === '') {
            throw new ValidationError('Wpisz hasło, aby się zalogować.');
        }
        if (password.length > 60 || password.length < 8) {
            throw new ValidationError('Hasło musi zawierać od 8 do 40 znaków.');
        }
    }
    async insertNewUser(): Promise<string> {
        if (!this.userId) {
            this.userId = uuid();
        } else {
            throw new ValidationError('Cannot insert someone who is already added!');
        }
        await pool.execute('INSERT INTO `users` VALUES (:userId, :name, :email, :login, :password)', {
            userId: this.userId,
            name:this.name.toUpperCase(),
            email: this.email,
            login: this.login,
            password:this.password,
        })
        return this.userId;
    }
    static async getUser(login: string): Promise<RegistrationRecord> {
        const [results] = await pool.execute('SELECT * FROM `users` WHERE `login`= :login', {
           login
        }) as RegistrationRecordResult;
        return results.length === 0 ? null : new RegistrationRecord(results[0]);
    }
}
