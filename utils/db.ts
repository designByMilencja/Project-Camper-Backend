import {createPool} from "mysql2/promise";
export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    database: 'project_camper',
    namedPlaceholders: true,
    decimalNumbers:true,
})
