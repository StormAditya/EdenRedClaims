const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema({
  totalAmount: { type: Number, default: 0.0 },
  date: { type: Date },
  items: [{
    name: { type: String, required: false },
    price: { type: Number, required: false }
  }],
  imageBuffer: { type: String }, 
  claim_id: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});
const Receipt = mongoose.model('Receipt', ReceiptSchema);

module.exports = Receipt;