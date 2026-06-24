const Receipt = require('./models/Receipt'); 

const processReceiptWithQwen = async (base64Image) => {
  try {
    
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    
    const url = 'http://127.0.0.1:11434/api/chat'; 

    const payload = {
      model: 'qwen2.5vl',
      messages: [
        {
          role: 'user',
          content: 'Analyze this receipt image and extract the total amount, date, and individual items.',
          images: [cleanBase64]
        }
      ],
      
      format: {
        type: 'object',
        properties: {
          totalAmount: { type: 'number' },
          date: { type: 'string', description: 'YYYY-MM-DD format or empty if not found' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                price: { type: 'number' }
              },
              required: ['name', 'price']
            }
          }
        },
        required: ['totalAmount', 'date', 'items']
      },
      options: { 
        temperature: 0.0 
      },
      stream: false 
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Ollama HTTP Server Error! Status: ${response.status}`);
    }

    const result = await response.json();
    
    
    return JSON.parse(result.message.content);

  } catch (error) {
    console.error("HTTP Ollama extraction step failed:", error);
    throw error;
  }
};


const BATCH_INTERVAL_MS = 2 * 60 * 1000; 
let timeRemaining = BATCH_INTERVAL_MS;

const runBatchProcessing = async () => {
  console.log(`\n[${new Date().toLocaleTimeString()}] 🚀 Starting batch processing for raw receipts...`);

  try {
    
    const unprocessedReceipts = await Receipt.find({
      $or: [
        { items: { $exists: true, $size: 0 } },
        { totalAmount: 0 }
      ],
      imageBuffer: { $exists: true, $ne: "" }
    });

    if (unprocessedReceipts.length === 0) {
      console.log('✨ No new unprocessed receipts found in this cycle.');
      return;
    }

    console.log(`📦 Found ${unprocessedReceipts.length} receipt(s) ready to process.`);

    
    for (const receipt of unprocessedReceipts) {
      try {
        console.log(`⏳ Querying Qwen2.5-VL for Claim ID: ${receipt.claim_id}...`);

        const structuredData = await processReceiptWithQwen(receipt.imageBuffer);

        
        receipt.totalAmount = structuredData.totalAmount || 0.0;
        
        
        if (structuredData.date && !isNaN(Date.parse(structuredData.date))) {
          receipt.date = new Date(structuredData.date);
        } else {
          receipt.date = new Date(); 
          console.log(`⚠️ Invalid or missing date string ("${structuredData.date}") from AI for Claim ${receipt.claim_id}. Defaulted to today.`);
        }
        
        
        receipt.items = structuredData.items || [];

        
        await receipt.save();
        console.log(`✅ Successfully extracted & stored Claim ID: ${receipt.claim_id}`);

      } catch (singleError) {
        console.error(`❌ Failed to process individual Claim ID ${receipt.claim_id}:`, singleError.message);
      }
    }

    console.log('🏁 Batch processing cycle completed.');

  } catch (batchError) {
    console.error('💥 Critical error encountered during the batch execution pipeline:', batchError);
  }
};


runBatchProcessing();


setInterval(() => {
  timeRemaining -= 10000; 

  if (timeRemaining <= 0) {
    timeRemaining = BATCH_INTERVAL_MS; 
    runBatchProcessing();
  } else {
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
    console.log(`⏱️ Next batch processing in: ${minutes}m ${seconds.padStart(2, '0')}s`);
  }
}, 10000); 