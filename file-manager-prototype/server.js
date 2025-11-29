// server.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Multer setup (file upload) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // folder to store files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// ---------- Middlewares ----------
app.use(express.json());

// Serve static files directly (for quick viewing in browser)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Routes ----------

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'File Manager Prototype API is running ✅' });
});

// 1) Upload a file
// Send form-data: key = "file"
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const filePath = path.join('uploads', file.filename);

    const [result] = await db.execute(
      `INSERT INTO files (original_name, stored_name, mime_type, size, path)
       VALUES (?, ?, ?, ?, ?)`,
      [
        file.originalname,
        file.filename,
        file.mimetype,
        file.size,
        filePath,
      ]
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: result.insertId,
        original_name: file.originalname,
        stored_name: file.filename,
        mime_type: file.mimetype,
        size: file.size,
        path: filePath,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// 2) List all files
app.get('/files', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, original_name, mime_type, size, uploaded_at FROM files ORDER BY uploaded_at DESC'
    );
    res.json({ files: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch files' });
  }
});

// 3) Get file metadata by id
app.get('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const [rows] = await db.execute(
      'SELECT * FROM files WHERE id = ?',
      [fileId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ file: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch file info' });
  }
});

// 4) Download file by id
app.get('/files/:id/download', async (req, res) => {
  try {
    const fileId = req.params.id;
    const [rows] = await db.execute(
      'SELECT * FROM files WHERE id = ?',
      [fileId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = rows[0];
    const absolutePath = path.join(__dirname, file.path);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'File missing on disk' });
    }

    res.download(absolutePath, file.original_name);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Download failed' });
  }
});

// 5) Delete file by id
app.delete('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const [rows] = await db.execute(
      'SELECT * FROM files WHERE id = ?',
      [fileId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = rows[0];
    const absolutePath = path.join(__dirname, file.path);

    // Delete from DB first
    await db.execute('DELETE FROM files WHERE id = ?', [fileId]);

    // Then try to delete from disk
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
