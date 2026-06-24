const express = require('express')
const multer = require('multer')

const {createReceipt, getReceipt, deleteReceipt, updateReceipt} = require('../controllers/controller-receipt');

const router = express.Router()

router.post('/api/receipts', createReceipt);
router.get('/api/receipts/:id', getReceipt);
router.delete('/api/receipts', deleteReceipt);
router.patch('/api/receipts', updateReceipt);

module.exports = router;