export async function processBatchQueue() {
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
