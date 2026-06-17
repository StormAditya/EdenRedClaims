const express = require('express')
const router = express.Router()
const { createClaim } = require('../controllers/controller-claim')
const { findReceiptInfo, addReceiptInfo, deleteReceiptInfo} = require('../controllers/controller-receipt')
router.post('/claims', createClaim)
router.post('/receipts/find',findReceiptInfo)
router.post('/receipts/add',addReceiptInfo)
router.delete('/receipts/:id', deleteReceiptInfo)
module.exports = router