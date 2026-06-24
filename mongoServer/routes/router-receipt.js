const express = require('express')
const multer = require('multer')

const {addReceipt} = require('../controllers/controller-receipt');

const router = express.Router()

router.post('/api/receipts', addReceipt);

module.exports = router;