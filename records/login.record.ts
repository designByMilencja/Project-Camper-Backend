import {LoginEntity} from "../types/login.entity";

export class LoginRecord implements LoginEntity {
    login: string;
    password: string;

    constructor(obj: LoginRecord) {
        const {login, password} = obj;
        this.login = login;
        this.password = password;
    }
}
