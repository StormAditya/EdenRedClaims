const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

// ==========================================
// 1. DATABASE CONFIGURATION & INITIALIZATION
// ==========================================

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false, 
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

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


const STATUS_APPROVED = 2; 
const STATUS_REJECTED = 3; 
const STATUS_PARTIAL_APPROVED = 4; 

const getMonthDifference = (date1, date2) => {
  return (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth());
};



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
      throw new Error(`Ollama Server Error with Status: ${response.status}`);
    }

    const result = await response.json();
    return JSON.parse(result.message.content);

  } catch (error) {
    console.error("extraction failed:", error);
    throw error;
  }
};

let isProcessing = false;

const runBatchProcessing = async () => {
  if (isProcessing) {
    console.log(`\n[${new Date().toLocaleTimeString()}] Skipping cycle.`);
    return;
  }

  isProcessing = true;
  console.log(`\n[${new Date().toLocaleTimeString()}] Cron Triggered...`);

  try {
    const unprocessedReceipts = await Receipt.find({
      $or: [
        { items: { $exists: true, $size: 0 } },
        { totalAmount: 0 }
      ],
      imageBuffer: { $exists: true, $ne: "" }
    });

    if (unprocessedReceipts.length === 0) {
      console.log('No new receipts found.');
      isProcessing = false;
      return;
    }

    console.log(`Found ${unprocessedReceipts.length} receipt(s).`);

    for (const receipt of unprocessedReceipts) {
      try {
        console.log(`\nQuerying Qwen2.5-VL for Claim ID: ${receipt.claim_id}...`);
        const structuredData = await processReceiptWithQwen(receipt.imageBuffer);

        receipt.totalAmount = structuredData.totalAmount || 0.0;
        let isDateInvalid = false;

        if (structuredData.date && !isNaN(Date.parse(structuredData.date))) {
          receipt.date = new Date(structuredData.date);
        } else {
          receipt.date = null; 
          isDateInvalid = true;
          console.log(` Invalid date string for Claim ${receipt.claim_id}. Rejected.`);
        }
        
        receipt.items = structuredData.items || [];
        await receipt.save();
        console.log(`Receipt data saved`);

        const pgClaim = await Claims.findByPk(receipt.claim_id);

        if (!pgClaim) {
          console.log(`Claim ID ${receipt.claim_id} not found in PostgreSQL.`);
          continue;
        }

        if (isDateInvalid) {
          pgClaim.status_id = STATUS_REJECTED;
          pgClaim.validation_date = new Date();
          await pgClaim.save();
          console.log(`Claim REJECTED  due to missing receipt date.`);
          continue; 
        }

        const pgAmount = parseFloat(pgClaim.claim_amount);
        const mongoAmount = parseFloat(receipt.totalAmount);
        
        const submissionDate = new Date(pgClaim.submission_date);
        const receiptDate = new Date(receipt.date);

        const monthDiff = getMonthDifference(submissionDate, receiptDate);
        const isWithinThreeMonths = monthDiff >= 0 && monthDiff <= 3;
        
        const isAmountValid = pgAmount <= mongoAmount;

        console.log(`Validation Metrics for Claim ${receipt.claim_id}:`);
        console.log(`   - Claim Amount: ${pgAmount} | Receipt Amount: ${mongoAmount} -> Validity: ${isAmountValid}`);
        console.log(`   - Submission Date: ${submissionDate.toISOString().split('T')[0]} | Receipt Date: ${receiptDate.toISOString().split('T')[0]} -> Valid Window: ${isWithinThreeMonths}`);

        if (isAmountValid && isWithinThreeMonths) {

          const user = await User.findByPk(pgClaim.user_id);

          if (!user) {
            console.log(`User not found. Rejected.`);
            pgClaim.status_id = STATUS_REJECTED;
          } else {
            const currentBalance = user.balance || 0.0;

            console.log(`Balance Check for User ${user.name} (ID: ${user.id}):`);
            console.log(` - Current Balance: ${currentBalance} | Claim Cost: ${pgAmount}`);

            if (pgAmount <= currentBalance) {
              const updatedBalance = parseFloat((currentBalance - pgAmount).toFixed(2));
              
              user.balance = updatedBalance;
              await user.save();
              console.log(`Sufficient balance. ${pgAmount} transacted. New balance: ${updatedBalance}`);

              pgClaim.status_id = STATUS_APPROVED; 
              pgClaim.approved_amount = pgAmount; 
              console.log(`Claim ${receipt.claim_id} fully APPROVED for: ${pgAmount}.`);

            } else if (currentBalance > 0 && currentBalance < pgAmount) {
              const partialApprovedAmount = currentBalance;
              
              user.balance = 0.0; 
              await user.save();
              console.log(` Partial Balance. New balance: 0.0`);

              pgClaim.status_id = STATUS_PARTIAL_APPROVED; 
              pgClaim.approved_amount = partialApprovedAmount;
              console.log(`Claim ${receipt.claim_id} PARTIALLY APPROVED for amount: ${partialApprovedAmount}.`);

            } else {
              console.log(`Insufficient balance (${currentBalance}). Claim REJECTED.`);
              pgClaim.status_id = STATUS_REJECTED; 
              pgClaim.approved_amount = 0.0;
            }
          }

        } else {
          pgClaim.status_id = STATUS_REJECTED;
          console.log(`Claim ${receipt.claim_id} failed validation. REJECTED.`);
        }

        pgClaim.validation_date = new Date(); 
        await pgClaim.save();
        console.log(`data saved: ${receipt.claim_id}`);

      } catch (singleError) {
        console.error(`Failed to process for claimID ${receipt.claim_id}:`, singleError.message);
      }
    }

    console.log('\nProcessing completed.');

  } catch (batchError) {
    console.error('failed due to Error:', batchError);
  } finally {
    isProcessing = false;
  }
};


console.log('Initializing...');

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

  console.log(`Next processing in: ${displayMinutes}m ${displaySeconds.toString().padStart(2, '0')}s`);
}, 10000);