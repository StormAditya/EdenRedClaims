const express = require('express')
const multer = require('multer')

const {createReceipt, getReceipt} = require('../controllers/controller-receipt');

const router = express.Router()

router.post('/api/receipts', createReceipt);
router.get('/api/receipts', getReceipt);

module.exports = router;