import mysql from "mysql2/promise";
import { DB_CONFIG } from "./constants";

const pool = mysql.createPool(DB_CONFIG);

export async function query(sql: string, params?: any[]) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function getConnection() {
  return pool.getConnection();
}

export default pool;
