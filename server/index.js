import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import svgCaptcha from 'svg-captcha';
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
    // Initialize Settings Table (Postgres compatible)
    try {
      await db.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY DEFAULT 1,
                facebook_url TEXT,
                instagram_url TEXT,
                linkedin_url TEXT,
                tiktok_url TEXT,
                youtube_url TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
      // Initial insert
      try {
          await db.query(`
            INSERT INTO settings (id, facebook_url, instagram_url, linkedin_url, tiktok_url, youtube_url)
            VALUES (1, '', '', '', '', '')
            ON CONFLICT (id) DO NOTHING
          `);
      } catch (e) {
          // Ignore unique constraint error if row exists
      }
      console.log('✅ Settings table verified.');
    } catch (err) {
      console.error('❌ Settings table init failed:', err.message);
    }
  })
  .catch(err => {
    console.error('❌ Database Connection Failed:', err.message);
  });

app.use(cors());
// INCREASE BODY SIZE LIMIT to 50MB to handle large base64 images from BlockNote
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Captcha Generation
app.get('/api/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
      size: 6,
      ignoreChars: '0o1i',
      noise: 2,
      color: true,
      background: '#27272a' // zinc-800 to match UI
  });

  // Sign the captcha text into a short-lived token to stay stateless
  const captchaToken = jwt.sign(
      { text: captcha.text.toLowerCase() },
      SECRET_KEY,
      { expiresIn: '5m' }
  );

  res.json({
      image: captcha.data,
      token: captchaToken
  });
});

// Configure MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "dummy_key_for_dev",
});

// Login - Step 1: Verify Credentials & Captcha, Send OTP
app.post('/api/login', async (req, res) => {
  const { username, password, captchaValue, captchaToken } = req.body;

  try {
    // 1. Verify Captcha
    if (!captchaValue || !captchaToken) {
        return res.status(400).json({ message: 'Captcha is required' });
    }

    try {
        const decodedCaptcha = jwt.verify(captchaToken, SECRET_KEY);
        if (decodedCaptcha.text !== captchaValue.toLowerCase()) {
            return res.status(400).json({ message: 'Invalid captcha' });
        }
    } catch (e) {
        return res.status(400).json({ message: 'Captcha expired or invalid' });
    }

    // 2. Verify Credentials
    const [rows] = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows && rows.length > 0) {
      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
          // 3. Generate and Save OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
          const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes from now

          await db.query(
              'UPDATE users SET otp = $1, otp_expires_at = $2 WHERE id = $3',
              [otp, expiresAt, user.id]
          );

          // 4. Send OTP via MailerSend
          try {
              const sentFrom = new Sender("noreply@diadem.com", "Diadem Admin");
              const recipients = [new Recipient(user.email, user.username)];

              const emailParams = new EmailParams()
                .setFrom(sentFrom)
                .setTo(recipients)
                .setSubject("Admin Portal OTP")
                .setHtml(`<strong>Your OTP for Diadem Admin Portal login is: ${otp}</strong><br>It will expire in 10 minutes.`)
                .setText(`Your OTP for Diadem Admin Portal login is: ${otp}. It will expire in 10 minutes.`);

              if (process.env.MAILERSEND_API_KEY && process.env.MAILERSEND_API_KEY !== 'dummy_key_for_dev') {
                  await mailerSend.email.send(emailParams);
                  console.log("OTP email sent via MailerSend.");
              } else {
                  console.log("MAILERSEND_API_KEY not set. OTP IS:", otp);
              }

          } catch (emailErr) {
              console.error("Failed to send OTP email via MailerSend:", emailErr);
              console.log("Email failed, but OTP is:", otp);
          }

          res.json({
              message: 'OTP sent to registered email',
              requireOtp: true,
              username: user.username
          });
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

// Login - Step 2: Verify OTP
app.post('/api/login/verify-otp', async (req, res) => {
    const { username, otp } = req.body;

    if (!username || !otp) {
        return res.status(400).json({ message: 'Username and OTP are required' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (!rows || rows.length === 0) {
            return res.status(401).json({ message: 'Invalid request' });
        }

        const user = rows[0];

        // Check if OTP matches and is not expired
        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        if (new Date() > new Date(user.otp_expires_at)) {
            return res.status(401).json({ message: 'OTP has expired' });
        }

        // OTP is valid. Clear it and issue JWT token
        await db.query('UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE id = $1', [user.id]);

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ id: user.id, username: user.username, role: user.role, token });

    } catch (error) {
        console.error("OTP Verification Error:", error);
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
  const { title, slug, category, excerpt, content, cover_image, published_at, author } = req.body;

  try {
    // Add RETURNING id for Postgres compatibility
    const [result] = await db.query(
      'INSERT INTO articles (title, slug, category, excerpt, content, cover_image, published_at, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
      [title, slug, category, excerpt, content, cover_image, published_at, author || 'Diadem']
    );
    // If returning ID works, insertId will be populated by our wrapper if it parses res.rows[0].id
    // But to be safe, let's assume result.rows[0].id exists if our wrapper passed it through.
    const newId = result.insertId || (result.rows && result.rows[0] && result.rows[0].id);

    res.status(201).json({ id: newId, ...req.body });
  } catch (error) {
    console.error("Insert Article Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/articles/:id', authenticateToken, async (req, res) => {
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
      'INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?) RETURNING id',
      [name, email, phone, message]
    );
    const newId = result.insertId || (result.rows && result.rows[0] && result.rows[0].id);
    res.status(201).json({ id: newId, ...req.body });
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
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?) RETURNING id',
            [username, hashedPassword, role || 'client']
        );
        const newId = result.insertId || (result.rows && result.rows[0] && result.rows[0].id);
        res.status(201).json({ id: newId, username, role });
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
            'INSERT INTO banners (title, imageUrl, link, active, list_order) VALUES (?, ?, ?, ?, ?) RETURNING id',
            [title, imageUrl, link, active !== undefined ? active : true, list_order || 0]
        );
        const newId = result.insertId || (result.rows && result.rows[0] && result.rows[0].id);
        res.status(201).json({ id: newId, ...req.body });
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
        // Postgres UPSERT syntax
        await db.query(`
            INSERT INTO site_stats (id, views) VALUES (1, 1)
            ON CONFLICT (id) DO UPDATE SET views = site_stats.views + 1
        `);
        res.json({ message: 'View counted' });
    } catch (error) {
         res.status(500).json({ message: error.message });
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
