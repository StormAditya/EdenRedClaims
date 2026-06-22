const express = require('express')
const router = express.Router()
const { createClaim, updateClaimEmployee, removeClaim, getClaims } = require('../controllers/controller-claim')
const { findReceiptInfo, addReceiptInfo, deleteReceiptInfo} = require('../controllers/controller-receipt')
const { createItem, getAllItems, getItemsByReceipt, updateItem, removeItem } = require("../controllers/controller-items")
const {isAuth} = require('../utils/authentication')
router.post('/claims', isAuth, createClaim)
router.patch('/claims', isAuth, updateClaimEmployee)
router.delete('/claims',  removeClaim)
router.get('/claims',isAuth, getClaims)

router.post('/receipts/find',findReceiptInfo)
router.post('/receipts/add',addReceiptInfo)
router.delete('/receipts', deleteReceiptInfo)

module.exports = router