import mysql  from 'mysql2/promise';
import config from "../config.js";

export async function query(sql, params) {
    try{
    
        const connection     = await mysql.createConnection(config.db);
        const [rows,] = await connection.execute(sql, params);
        return rows
    }catch(e){
        throw e
    }
}
