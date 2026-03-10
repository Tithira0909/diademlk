import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create a new pool using environment variables
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'diadem_db',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Wrapper to allow named exports and mimic mysql2/sqlite wrapper interface
// This converts '?' placeholders (MySQL/SQLite style) to '$1', '$2' (Postgres style)
export const db = {
  query: async (text, params = []) => {
    // Convert ? to $1, $2, etc.
    let paramIndex = 1;
    const pgText = text.replace(/\?/g, () => `$${paramIndex++}`);

    try {
      const res = await pool.query(pgText, params);

      // Normalize result to match what the app expects: [rows, fields]
      // For SELECT, return rows.
      // For INSERT/UPDATE/DELETE, we need to return something that mimics mysql2 'result' object
      // if the app uses result.insertId, we need to handle that via RETURNING id in the query
      // or simply return the raw response and adapt the controller.

      // Given the current controller code uses:
      // const [rows] = await db.query('SELECT...') -> rows is array of items
      // const [result] = await db.query('INSERT...') -> result.insertId

      if (text.trim().toUpperCase().startsWith('SELECT')) {
          return [res.rows];
      } else {
          // For INSERT, UPDATE, DELETE
          // Postgres doesn't return insertId by default unless you use RETURNING id.
          // We will rely on the controller logic being updated or this wrapper handling it.
          // However, automatically appending RETURNING id is risky for generic queries.
          // Let's return a hybrid object.
          return [{
              insertId: res.rows.length > 0 ? res.rows[0].id : null,
              affectedRows: res.rowCount,
              rows: res.rows
          }];
      }
    } catch (err) {
      console.error('Database Query Error:', err.message, '\nQuery:', pgText);
      throw err;
    }
  },
  end: () => pool.end()
};
