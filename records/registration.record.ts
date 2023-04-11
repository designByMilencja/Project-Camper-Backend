import {RegistrationEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/config.db";
import {FieldPacket} from "mysql2";

type RegistrationRecordResult = [RegistrationEntity[], FieldPacket[]];

export class RegistrationRecord implements RegistrationEntity {
    id: string;
    name: string;
    email: string;
    login: string;
    password: string;
    emailVerified: boolean;
    verificationKey:string | null;

    constructor(obj: RegistrationEntity) {
        const {id, name, email, login, password, verificationKey} = obj;
        this.id = id;
        this.name = name;
        this.email = email;
        this.login = login;
        this.password = password;
        this.emailVerified = false;
        this.verificationKey= verificationKey;

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

    async insertNewUser(): Promise<{ id: string, email: string }> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert someone who is already added!');
        }
        await pool.execute('INSERT INTO `users` VALUES (:id, :name, :email, :login, :password, :emailVerified, :verificationKey)', {
            id: this.id,
            name: this.name.toUpperCase(),
            email: this.email,
            login: this.login,
            password: this.password,
            emailVerified: this.emailVerified,
            verificationKey: this.verificationKey,
        })
        return {id: this.id, email: this.email}
    }

    static async getUserByKey(verificationKey:string): Promise<RegistrationRecord> {
        const [results] = await pool.execute('SELECT * FROM `users` WHERE `verificationKey`= :verificationKey', {
            verificationKey,
        }) as RegistrationRecordResult;
        return results.length === 0 ? null : new RegistrationRecord(results[0]);
    }
    static async getUserByLogin(login: string): Promise<RegistrationRecord> {
        const [results] = await pool.execute('SELECT * FROM `users` WHERE `login`= :login', {
            login,
        }) as RegistrationRecordResult;
        return results.length === 0 ? null : new RegistrationRecord(results[0]);
    }

    async updateUser(): Promise<void> {
        await pool.execute('UPDATE `users` SET `emailVerified`=:emailVerified WHERE `email`=:email', {
            emailVerified: this.emailVerified,
            email: this.email,
        });
    }
}
