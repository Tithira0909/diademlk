import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

// Check Database Connection on Startup
db.query('SELECT 1')
  .then(async () => {
    console.log('✅ Database connected successfully.');
    // Initialize Settings Table
    try {
      await db.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT PRIMARY KEY DEFAULT 1,
                facebook_url VARCHAR(255),
                instagram_url VARCHAR(255),
                linkedin_url VARCHAR(255),
                tiktok_url VARCHAR(255),
                youtube_url VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
          `);
      await db.query(`
            INSERT IGNORE INTO settings (id, facebook_url, instagram_url, linkedin_url, tiktok_url, youtube_url)
            VALUES (1, '', '', '', '', '')
          `);
      console.log('✅ Settings table verified.');
    } catch (err) {
      console.error('❌ Settings table init failed:', err.message);
    }
  })
  .catch(err => {
    console.error('❌ Database Connection Failed:', err.message);
    console.error('Hint: Run "npm run setup" to create the database, or check your .env credentials.');
  });

app.use(cors());
app.use(express.json());
// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend statically
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// --- FILE UPLOAD SETUP ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// File Upload
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
          const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
          res.json({ id: user.id, username: user.username, role: user.role, token });
      } else {
          res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Articles
app.get('/api/articles', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error("Fetch Articles Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/articles', authenticateToken, async (req, res) => {
  // Updated to match BlockNote & Frontend structure
  const { title, slug, category, excerpt, content, cover_image, published_at, author } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO articles (title, slug, category, excerpt, content, cover_image, published_at, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, category, excerpt, content, cover_image, published_at, author || 'Diadem']
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error("Insert Article Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/articles/:id', authenticateToken, async (req, res) => {
  // Updated to match BlockNote & Frontend structure
  const { title, slug, category, excerpt, content, cover_image, published_at, author } = req.body;

  try {
    await db.query(
      'UPDATE articles SET title = ?, slug = ?, category = ?, excerpt = ?, content = ?, cover_image = ?, published_at = ?, author = ? WHERE id = ?',
      [title, slug, category, excerpt, content, cover_image, published_at, author || 'Diadem', req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error("Update Article Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Inquiries
app.get('/api/inquiries', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inquiries ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Users
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, role FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/users', authenticateToken, async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role || 'client']
        );
        res.status(201).json({ id: result.insertId, username, role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Banners ---
app.get('/api/banners', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM banners WHERE active = TRUE ORDER BY list_order ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/banners', authenticateToken, async (req, res) => {
    const { title, imageUrl, link, active, list_order } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO banners (title, imageUrl, link, active, list_order) VALUES (?, ?, ?, ?, ?)',
            [title, imageUrl, link, active !== undefined ? active : true, list_order || 0]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/banners/:id', authenticateToken, async (req, res) => {
    try {
        await db.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
        res.json({ message: 'Banner deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Site Views ---
app.get('/api/views', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT views FROM site_stats WHERE id = 1');
        res.json({ views: rows[0]?.views || 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/views/increment', async (req, res) => {
    try {
        await db.query('UPDATE site_stats SET views = views + 1 WHERE id = 1');
        res.json({ message: 'View counted' });
    } catch (error) {
         // Fail silently or create row if missing
         try {
             await db.query('INSERT INTO site_stats (id, views) VALUES (1, 1) ON DUPLICATE KEY UPDATE views = views + 1');
             res.json({ message: 'View counted' });
         } catch(e) {
             res.status(500).json({ message: e.message });
         }
    }
});

// --- Settings ---
app.get('/api/settings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM settings WHERE id = 1');
        res.json(rows[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
    const { facebook_url, instagram_url, linkedin_url, tiktok_url, youtube_url } = req.body;
    try {
        await db.query(
            'UPDATE settings SET facebook_url = ?, instagram_url = ?, linkedin_url = ?, tiktok_url = ?, youtube_url = ? WHERE id = 1',
            [facebook_url, instagram_url, linkedin_url, tiktok_url, youtube_url]
        );
        res.json({ message: 'Settings updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
