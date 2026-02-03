CREATE DATABASE IF NOT EXISTS diadem_db;
USE diadem_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Bcrypt hash
    role ENUM('admin', 'client') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    excerpt TEXT,
    content TEXT,
    image VARCHAR(500),
    pdfUrl VARCHAR(500),
    readTime VARCHAR(50),
    author VARCHAR(100),
    date VARCHAR(100), -- Storing as string to match frontend format, or use DATE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    message TEXT,
    date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banners Table
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    imageUrl VARCHAR(500) NOT NULL,
    link VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    list_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Stats Table
CREATE TABLE IF NOT EXISTS site_stats (
    id INT PRIMARY KEY DEFAULT 1,
    views INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Data (Password is 'password')
INSERT INTO users (username, password, role) VALUES
('admin', '$2b$10$MQ2PaEuO27t1mG.ZrzPoqOflOzbc1O4feVYFjhObrb.MDoDMhWk7q', 'admin'),
('client', '$2b$10$MQ2PaEuO27t1mG.ZrzPoqOflOzbc1O4feVYFjhObrb.MDoDMhWk7q', 'client')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO articles (title, category, excerpt, content, image, readTime, author, date) VALUES
(
    "Navigating Sri Lanka's New Export Regulations (2025)",
    "Regulations",
    "A comprehensive guide to the latest customs updates.",
    "<p>Content here...</p>",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "5 min read",
    "Dr. A. Perera",
    "Dec 02, 2024"
)
ON DUPLICATE KEY UPDATE id=id;

INSERT IGNORE INTO site_stats (id, views) VALUES (1, 0);
