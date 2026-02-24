import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setup() {
    console.log("Starting Database Setup...");

    try {
        // 1. Open SQLite Database
        console.log("Connecting to SQLite...");
        const db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });
        console.log("Connected.");

        // 2. Read Schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        console.log(`Reading schema from ${schemaPath}...`);
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // 3. Convert MySQL schema to SQLite (basic conversion)
        // Note: This is a hacky conversion. Ideally, maintain separate schemas.
        const sqliteSchema = schema
            .replace(/INT AUTO_INCREMENT PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT')
            .replace(/INT PRIMARY KEY DEFAULT 1/g, 'INTEGER PRIMARY KEY DEFAULT 1')
            .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/g, 'TEXT DEFAULT CURRENT_TIMESTAMP')
            .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'TEXT DEFAULT CURRENT_TIMESTAMP')
            .replace(/ENUM\([^)]+\)/g, 'TEXT')
            .replace(/LONGTEXT/g, 'TEXT')
            .replace(/INSERT IGNORE INTO/g, 'INSERT OR IGNORE INTO')
            .replace(/ON DUPLICATE KEY UPDATE id=id/g, '') // Remove MySQL specific
            .split(';');

        // 4. Execute Schema
        console.log("Executing schema...");
        for (const query of sqliteSchema) {
            if (query.trim()) {
                // SQLite doesn't support 'USE dbname' or 'CREATE DATABASE' in the same way
                if (!query.includes('CREATE DATABASE') && !query.includes('USE')) {
                     await db.exec(query);
                }
            }
        }
        console.log("Schema applied successfully.");

        console.log("\n✅ Setup Complete! You can now start the server.");

    } catch (error) {
        console.error("\n❌ Setup Failed:");
        console.error(error);
        process.exit(1);
    }
}

setup();
