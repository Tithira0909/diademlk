import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function setup() {
    console.log("Starting PostgreSQL Database Setup...");

    const dbConfig = {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };

    const dbName = process.env.DB_NAME || 'diadem_db';

    // 1. Create Database if not exists
    // Postgres cannot create database inside a transaction block or conditionally easily via query.
    // We connect to 'postgres' db first.
    let client = new Client({ ...dbConfig, database: 'postgres' });

    try {
        await client.connect();

        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            console.log(`Creating database '${dbName}'...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
        await client.end();

    } catch (err) {
        console.error("Error creating database:", err.message);
        if (client) await client.end();
        process.exit(1);
    }

    // 2. Connect to the specific database and create tables
    client = new Client({ ...dbConfig, database: dbName });

    try {
        await client.connect();
        console.log(`Connected to '${dbName}'. Creating tables...`);

        // Users
        // Need to alter the table to add missing columns since IF NOT EXISTS won't update it
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'client',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        try {
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE DEFAULT 'admin@diadem.com'`);
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp VARCHAR(10)`);
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP`);
        } catch (e) {
            console.log("Columns may already exist, skipping alter");
        }

        // Articles
        await client.query(`
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                excerpt TEXT,
                content TEXT,
                cover_image VARCHAR(500),
                category VARCHAR(100),
                published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                author VARCHAR(100) DEFAULT 'Diadem',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Inquiries
        await client.query(`
            CREATE TABLE IF NOT EXISTS inquiries (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(50),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Banners
        await client.query(`
            CREATE TABLE IF NOT EXISTS banners (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                imageUrl VARCHAR(500) NOT NULL,
                link VARCHAR(500),
                active BOOLEAN DEFAULT TRUE,
                list_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Site Stats
        await client.query(`
            CREATE TABLE IF NOT EXISTS site_stats (
                id INTEGER PRIMARY KEY DEFAULT 1,
                views INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Settings
        await client.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY DEFAULT 1,
                facebook_url VARCHAR(255),
                instagram_url VARCHAR(255),
                linkedin_url VARCHAR(255),
                tiktok_url VARCHAR(255),
                youtube_url VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Seed Data
        console.log("Seeding initial data...");

        // Admin User (password: 'password')
        // Use ON CONFLICT to avoid errors on re-run
        await client.query(`
            INSERT INTO users (username, email, password, role)
            VALUES ('admin', 'admin@diadem.com', '$2b$10$MQ2PaEuO27t1mG.ZrzPoqOflOzbc1O4feVYFjhObrb.MDoDMhWk7q', 'admin')
            ON CONFLICT (username) DO UPDATE SET email = 'admin@diadem.com';
        `);

        await client.query(`
            INSERT INTO site_stats (id, views) VALUES (1, 0)
            ON CONFLICT (id) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO settings (id, facebook_url, instagram_url, linkedin_url, tiktok_url, youtube_url)
            VALUES (1, '', '', '', '', '')
            ON CONFLICT (id) DO NOTHING;
        `);

        console.log("✅ Setup Complete! You can now start the server.");
        await client.end();

    } catch (err) {
        console.error("❌ Setup Failed:", err);
        await client.end();
        process.exit(1);
    }
}

setup();
