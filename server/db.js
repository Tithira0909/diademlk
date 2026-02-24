import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Open SQLite database
export const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
});

// Helper to mimic MySQL 'query' function for compatibility
// We'll wrap db.all (for SELECT) and db.run (for INSERT/UPDATE)
const originalQuery = db.query; // Doesn't exist on sqlite driver wrapper usually
db.query = async (sql, params = []) => {
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
    try {
        if (isSelect) {
            const rows = await db.all(sql, params);
            return [rows]; // Return array to match [rows, fields] mysql2 signature
        } else {
            const result = await db.run(sql, params);
            // Map sqlite result to mysql2 result structure
            return [{
                insertId: result.lastID,
                affectedRows: result.changes
            }];
        }
    } catch(e) {
        console.error("SQL Error:", e.message, sql);
        throw e;
    }
};

export default db;
