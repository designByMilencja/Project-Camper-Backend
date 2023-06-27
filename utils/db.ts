import {config} from "../config/config";
import {createPool} from "mysql2/promise";

export const pool = createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    socketPath: config.socketPath,
    database: config.database,
    namedPlaceholders: true,
    decimalNumbers: true,
})
