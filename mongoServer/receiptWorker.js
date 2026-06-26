const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const cron = require('node-cron');

// ==========================================
// 1. DATABASE CONFIGURATION & INITIALIZATION
// ==========================================

const sequelize = new Sequelize('EdenClaim', 'postgres', 'AdityaDesai@12', {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false, 
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

// --- User Model ---
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' },
      notNull: { msg: 'Name is required' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' },
      notNull: { msg: 'Password is required' }
    }
  },
  email_id: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'email is required' },
      notNull: { msg: 'email is required' }
    }
  }, 
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_number: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  user_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isAlpha: true }
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
}, {
  tableName: 'User',
  timestamps: true,
  underscored: true
});

// --- Claims Model ---
const Claims = sequelize.define('Claims', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  claim_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Claim amount is required' },
      notNull: { msg: 'Claim amount is required' },
      isFloat: true
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  submission_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: { isDate: true }
  }, 
  validation_date: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: { isDate: true }
  },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  status_id: { type: DataTypes.INTEGER, allowNull: false },
  approved_amount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: 'Claims',
  timestamps: true,
  underscored: true
});

// --- MongoDB Setup (Mongoose) ---
const receiptSchema = new mongoose.Schema({
  claim_id: Number,
  totalAmount: Number,
  date: Date,
  imageBuffer: String,
  items: [
    {
      name: String,
      price: Number
    }
  ]
});
const Receipt = mongoose.models.Receipt || mongoose.model('Receipt', receiptSchema);


// ==========================================
// 2. CORE UTILITIES & SYSTEM CONSTANTS
// ==========================================

const STATUS_APPROVED = 2; 
const STATUS_REJECTED = 3; 
const STATUS_PARTIAL_APPROVED = 4; 

const getMonthDifference = (date1, date2) => {
  return (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth());
};


// ==========================================
// 3. OLLAMA VISION EXTRACTION
// ==========================================

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
      options: { temperature: 0.0 },
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


// ==========================================
// 4. CROSS-DB BATCH PROCESSING ENGINE
// ==========================================

let isProcessing = false;

const runBatchProcessing = async () => {
  if (isProcessing) {
    console.log(`\n[${new Date().toLocaleTimeString()}] ⏳ Previous batch is still running. Skipping this cycle.`);
    return;
  }

  isProcessing = true;
  console.log(`\n[${new Date().toLocaleTimeString()}] 🚀 Cron Triggered: Starting cross-db validation...`);

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
      isProcessing = false;
      return;
    }

    console.log(`📦 Found ${unprocessedReceipts.length} receipt(s) ready to process.`);

    for (const receipt of unprocessedReceipts) {
      try {
        console.log(`\n⏳ Querying Qwen2.5-VL for Claim ID: ${receipt.claim_id}...`);
        const structuredData = await processReceiptWithQwen(receipt.imageBuffer);

        receipt.totalAmount = structuredData.totalAmount || 0.0;
        let isDateInvalid = false;

        if (structuredData.date && !isNaN(Date.parse(structuredData.date))) {
          receipt.date = new Date(structuredData.date);
        } else {
          receipt.date = null; 
          isDateInvalid = true;
          console.log(`⚠️ Missing or corrupted date string from AI for Claim ${receipt.claim_id}. Marked for rejection.`);
        }
        
        receipt.items = structuredData.items || [];
        await receipt.save();
        console.log(`✅ Stored AI extractions in MongoDB for Claim ID: ${receipt.claim_id}`);

        const pgClaim = await Claims.findByPk(receipt.claim_id);

        if (!pgClaim) {
          console.log(`❌ Claim ID ${receipt.claim_id} not found in PostgreSQL. Skipping validation.`);
          continue;
        }

        // Rule: If date is not found, reject the claim automatically
        if (isDateInvalid) {
          pgClaim.status_id = STATUS_REJECTED;
          pgClaim.validation_date = new Date();
          await pgClaim.save();
          console.log(`🚫 Claim ${receipt.claim_id} REJECTED automatically due to missing receipt date.`);
          continue; 
        }

        // Extract transactional metrics
        const pgAmount = parseFloat(pgClaim.claim_amount);
        const mongoAmount = parseFloat(receipt.totalAmount);
        
        const submissionDate = new Date(pgClaim.submission_date);
        const receiptDate = new Date(receipt.date);

        const monthDiff = getMonthDifference(submissionDate, receiptDate);
        const isWithinThreeMonths = monthDiff >= 0 && monthDiff <= 3;
        
        // CHECK: Postgres claim amount must be less than or equal to Mongo receipt amount
        const isAmountValid = pgAmount <= mongoAmount;

        console.log(`📊 Validation Metrics for Claim ${receipt.claim_id}:`);
        console.log(`   - Postgres Claim: ${pgAmount} | Mongo Receipt: ${mongoAmount} -> Valid Framework: ${isAmountValid}`);
        console.log(`   - Submission Date: ${submissionDate.toISOString().split('T')[0]} | Receipt Date: ${receiptDate.toISOString().split('T')[0]} -> Valid Window: ${isWithinThreeMonths}`);

        // Base criteria validation check
        if (isAmountValid && isWithinThreeMonths) {
          
          // Fetch user data to verify balance availability
          const user = await User.findByPk(pgClaim.user_id);

          if (!user) {
            console.log(`❌ User ID ${pgClaim.user_id} associated with claim ${receipt.claim_id} not found. Rejecting.`);
            pgClaim.status_id = STATUS_REJECTED;
          } else {
            const currentBalance = user.balance || 0.0;

            console.log(`💳 Balance Check for User ${user.name} (ID: ${user.id}):`);
            console.log(`   - Current Balance: ${currentBalance} | Claim Cost: ${pgAmount}`);

            // Rule 1: Full balance deduction if sufficient funds are present
            if (pgAmount <= currentBalance) {
              const updatedBalance = parseFloat((currentBalance - pgAmount).toFixed(2));
              
              user.balance = updatedBalance;
              await user.save();
              console.log(`   ✅ Sufficient balance. Deducted claim amount ${pgAmount}. New balance: ${updatedBalance}`);

              pgClaim.status_id = STATUS_APPROVED; 
              pgClaim.approved_amount = pgAmount; 
              console.log(`🎉 Claim ${receipt.claim_id} validated and APPROVED for full claim amount: ${pgAmount}.`);

            // Rule 2: Partial approval if balance is > 0 but less than the claim amount
            } else if (currentBalance > 0 && currentBalance < pgAmount) {
              const partialApprovedAmount = currentBalance;
              
              user.balance = 0.0; // Entire balance drained
              await user.save();
              console.log(`   ⚠️ Partial Balance. Drained entire user balance of ${partialApprovedAmount}. New balance: 0.0`);

              pgClaim.status_id = STATUS_PARTIAL_APPROVED; 
              pgClaim.approved_amount = partialApprovedAmount;
              console.log(`🎉 Claim ${receipt.claim_id} PARTIALLY APPROVED for remaining balance: ${partialApprovedAmount}.`);

            // Rule 3: Insufficient/Zero balance
            } else {
              console.log(`   🚫 Insufficient balance (${currentBalance}). Claim cannot be approved.`);
              pgClaim.status_id = STATUS_REJECTED; 
              pgClaim.approved_amount = 0.0;
            }
          }

        } else {
          pgClaim.status_id = STATUS_REJECTED;
          console.log(`🚫 Claim ${receipt.claim_id} failed baseline metrics. Status set to REJECTED.`);
        }

        pgClaim.validation_date = new Date(); 
        await pgClaim.save();
        console.log(`💾 Successfully finalized database records for Claim ID: ${receipt.claim_id}`);

      } catch (singleError) {
        console.error(`❌ Failed to process individual Claim ID ${receipt.claim_id}:`, singleError.message);
      }
    }

    console.log('\n🏁 Batch processing cycle completed.');

  } catch (batchError) {
    console.error('💥 Critical error encountered during the batch execution pipeline:', batchError);
  } finally {
    isProcessing = false;
  }
};


// ==========================================
// 5. CRON SCHEDULE & LIVE COUNTDOWN TIMER
// ==========================================

console.log('⏰ Initializing Cron Service...');

cron.schedule('*/2 * * * *', () => {
  runBatchProcessing();
});

runBatchProcessing();

setInterval(() => {
  if (isProcessing) return;

  const now = new Date();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();

  const nextTargetMinute = currentMinutes + (2 - (currentMinutes % 2));
  
  const targetTime = new Date(now);
  targetTime.setMinutes(nextTargetMinute);
  targetTime.setSeconds(0);
  targetTime.setMilliseconds(0);

  const msRemaining = targetTime - now;

  const displayMinutes = Math.floor(msRemaining / 60000);
  const displaySeconds = Math.floor((msRemaining % 60000) / 1000);

  console.log(`⏱️ Next batch processing in: ${displayMinutes}m ${displaySeconds.toString().padStart(2, '0')}s`);
}, 10000);