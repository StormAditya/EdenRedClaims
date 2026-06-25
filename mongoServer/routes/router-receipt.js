const express = require('express')
const multer = require('multer')

const {createReceipt, getReceipt, deleteReceipt, updateReceipt, getAllReceipts, amountReceipt} = require('../controllers/controller-receipt');

const router = express.Router()

router.post('/api/receipts', createReceipt);
router.get('/api/receipts/:id', getReceipt);
router.delete('/api/receipts', deleteReceipt);
router.patch('/api/receipts', updateReceipt);
router.get('/api/receipts', getAllReceipts);
router.post('/api/receipts/amount', amountReceipt);
module.exports = router;