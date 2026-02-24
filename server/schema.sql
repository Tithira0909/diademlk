-- Database Schema for Diadem Website

-- Use or Create Database
CREATE DATABASE IF NOT EXISTS diadem_db;
USE diadem_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Bcrypt hash
    role ENUM('admin', 'client') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Articles Table (Updated for BlockNote & consistency)
-- Note: 'content' is LONGTEXT to support large JSON objects from BlockNote
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT, -- Stores BlockNote JSON
    cover_image VARCHAR(500), -- Renamed from 'image' for clarity, matches frontend
    category VARCHAR(100),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(100) DEFAULT 'Diadem',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Banners Table
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    imageUrl VARCHAR(500) NOT NULL,
    link VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    list_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Site Stats Table
CREATE TABLE IF NOT EXISTS site_stats (
    id INT PRIMARY KEY DEFAULT 1,
    views INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Settings Table (Social Links & Config)
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    tiktok_url VARCHAR(255),
    youtube_url VARCHAR(255),
    theme VARCHAR(20) DEFAULT 'light',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Seed Data
-- Users (password: 'password')
INSERT IGNORE INTO users (id, username, password, role) VALUES
(1, 'admin', '$2b$10$MQ2PaEuO27t1mG.ZrzPoqOflOzbc1O4feVYFjhObrb.MDoDMhWk7q', 'admin');

-- Initial Site Stats
INSERT IGNORE INTO site_stats (id, views) VALUES (1, 0);

-- Initial Settings
INSERT IGNORE INTO settings (id, facebook_url, instagram_url, linkedin_url, tiktok_url, youtube_url) VALUES (1, '', '', '', '', '');
