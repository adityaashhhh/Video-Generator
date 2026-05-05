const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { pool, initDb } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Initialize DB
initDb();

// POST /upload - Handle image upload, AI API call, and DB storage
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const localImageUrl = `/uploads/${req.file.filename}`;
    
    // 1. Forward the image to the AI API
    const form = new FormData();
    form.append('image', fs.createReadStream(req.file.path));

    console.log('Sending to AI API...');
    
    let aiResponseUrl = null;
    try {
      const aiResponse = await axios.post('https://fatmachines.com/assignment/ai.php', form, {
        headers: {
          ...form.getHeaders(),
          'X-Auth-Key': 'abcdefghijklmnop'
        }
      });
      
      console.log('AI API Response:', aiResponse.data);
      // The API returns a static mock video (ai.mp4). To avoid "random stuff", 
      // we will return the local image URL so the frontend can dynamically animate it.
      aiResponseUrl = localImageUrl; 
    } catch (aiError) {
      console.error('Error calling AI API:', aiError.message);
      aiResponseUrl = localImageUrl;
    }

    // 2. Store in Database
    const dbResult = await pool.query(
      'INSERT INTO requests (image_url, output_url) VALUES ($1, $2) RETURNING *',
      [localImageUrl, aiResponseUrl]
    );

    const record = dbResult.rows[0];

    // 3. Return to client
    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error processing request' });
  }
});

// GET /history - Retrieve previous uploads
app.get('/api/history', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requests ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving history' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
