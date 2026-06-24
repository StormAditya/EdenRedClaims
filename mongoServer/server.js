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

app.use(cors());
app.use(express.json());

// ==========================================================
// MONGOOSE DATABASE SCHEMA
// ==========================================================
const ReceiptSchema = new mongoose.Schema({
  totalAmount: { type: Number, default: 0.0 },
  date: { type: Date },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  imageBuffer: { type: String }, // Stores the raw base64 data url string natively
  uploadedAt: { type: Date, default: Date.now }
});
const Receipt = mongoose.model('Receipt', ReceiptSchema);

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

async function processBatchQueue() {
  console.log("\n⚡ [GPU VISION BATCH ACTION] Sweep triggered! Ingesting layouts directly...");
  
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const receiptFiles = files.filter(file => !file.startsWith('.'));

    if (receiptFiles.length === 0) {
      console.log("💤 Directory empty. No receipts waiting for visual parsing.");
      return;
    }

    console.log(`📦 Found ${receiptFiles.length} file(s) in queue. Initializing Qwen2.5-VL processor...`);

    await Promise.all(receiptFiles.map(async (fileName) => {
      const filePath = path.join(UPLOADS_DIR, fileName);
      
      try {
        console.log(`👁️ [${fileName}] Converting file to localized base64 string layout...`);
        const imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });

        // Wipe image off disk immediately now that it's stored safely in application RAM
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        console.log(`🧠 [${fileName}] Running data extraction matrix via Qwen2.5-VL...`);
        
        const prompt = `Analyze this receipt image natively using your visual tracking layers. Extract the transaction date (formatted as YYYY-MM-DD or null if missing), the absolute final grand total amount as a float number, and an array of individual line items containing "name" and "price".
        Respond ONLY with a valid, clean JSON object matching this schema, without markdown formatting blocks (like \`\`\`json), commentary, or extra text:
        {
          "totalAmount": 0.0,
          "date": "YYYY-MM-DD",
          "items": [{"name": "item description", "price": 0.0}]
        }`;

        // Stream visual request payload straight into Ollama native chat port mapping
        const ollamaResponse = await axios.post('http://127.0.0.1:11434/api/chat', {
          model: 'qwen2.5vl', 
          messages: [
            {
              role: 'user',
              content: prompt,
              images: [imageBase64]
            }
          ],
          stream: false,
          format: 'json'
        });

        const responseText = ollamaResponse.data.message.content;
        const parsedJson = JSON.parse(responseText);
        
        console.log(`✨ [${fileName}] Extracted JSON Structures:`, parsedJson);

        const processedDate = parsedJson.date ? new Date(parsedJson.date) : null;

        const savedReceipt = new Receipt({
          totalAmount: parsedJson.totalAmount || 0.0,
          date: isNaN(processedDate) ? null : processedDate,
          items: parsedJson.items || [],
          imageBuffer: `data:image/png;base64,${imageBase64}` // Prefix tells browser how to render text string as image
        });

        await savedReceipt.save();
        console.log(`✅ [${fileName}] Saved completely to MongoDB.`);

      } catch (fileError) {
        console.error(`❌ Visual Parse Failure on asset [${fileName}]:`, fileError.message);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }));

    console.log("🏁 Direct vision batch operation completed successfully.\n");

  } catch (error) {
    console.error("Critical folder read failure:", error);
  }
}

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