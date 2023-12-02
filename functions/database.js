import mysql  from 'mysql2/promise';
import config from "../config.js";

export async function query(sql, sqlParams) {
    try{
    
        const connection     = await mysql.createConnection(config.db);
        const [rows,] = await connection.execute(sql, sqlParams);
        return rows
    }catch(e){
        throw e
    }
}
