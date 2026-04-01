import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setup() {
    console.log("Starting Database Setup...");

    const connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        multipleStatements: true // Allow executing schema.sql at once
    };

    let connection;

    try {
        // 1. Connect without Database
        console.log("Connecting to MySQL...");
        connection = await mysql.createConnection(connectionConfig);
        console.log("Connected.");

        // 2. Create Database
        const dbName = process.env.DB_NAME || 'diadem_db';
        console.log(`Creating database '${dbName}' if not exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log("Database ready.");

        // 3. Select Database
        await connection.changeUser({ database: dbName });

        // 4. Read Schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        console.log(`Reading schema from ${schemaPath}...`);
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // 5. Execute Schema
        console.log("Executing schema...");
        await connection.query(schema);
        console.log("Schema applied successfully.");

        console.log("\n✅ Setup Complete! You can now start the server.");

    } catch (error) {
        console.error("\n❌ Setup Failed:");
        console.error(error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("Hint: Is your MySQL server running?");
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error("Hint: Check your DB_USER and DB_PASSWORD in .env");
        }
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

setup();
