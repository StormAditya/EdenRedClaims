require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;
const Receipt = require('./models/Receipt');
const { processBatchQueue } = require('./ProcessBatchQueue');
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully...'))
  .catch(err => console.error('MongoDB database connection error:', err));

// Configure local disk upload path strings
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ==========================================================
// 1-MINUTE COUNTDOWN & MULTIMODAL GPU ENGINE (Qwen2.5-VL)
// ==========================================================
const TOTAL_CYCLE_SECONDS = 60; // 1 minute = 60 seconds
let secondsRemaining = TOTAL_CYCLE_SECONDS;



// Global 10-second ticker interval
setInterval(() => {
  secondsRemaining -= 10;
  if (secondsRemaining <= 0) {
    processBatchQueue();
    secondsRemaining = TOTAL_CYCLE_SECONDS;
  } else {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    console.log(`⏰ Time until next local GPU sweep: [ ${timeString} ] (${secondsRemaining}s remaining)`);
  }
}, 10000);

// ==========================================================
// HTTP SERVICE ROUTER PATHS
// ==========================================================
// Endpoint A: Accept multi-file queue deposits from React
app.post('/api/receipts/upload-batch', upload.array('receipts', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No image files found in upload stream." });
  }
  res.status(202).json({ message: `${req.files.length} receipts stored securely for 1-minute Vision parsing.` });
});

// Endpoint B: Fetch historical dashboard entries
app.get('/api/receipts/history', async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ uploadedAt: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Offline Direct Vision hub active on port ${PORT}`);
  console.log(`Connected to MongoDB successfully...`);
  console.log(`⏳ Live countdown active. Running sweeps every 1:00 minute.\n`);
});