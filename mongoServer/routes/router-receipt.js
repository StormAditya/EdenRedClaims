const express = require('express')
const multer = require('multer')

const {createReceipt} = require('../controllers/controller-receipt');

const router = express.Router()

router.post('/api/receipts', createReceipt);

module.exports = router;