const express = require('express')
const router = express.Router()
const { createClaim, updateClaimEmployee, removeClaim, getClaims } = require('../controllers/controller-claim')
const { findReceiptInfo, addReceiptInfo, deleteReceiptInfo} = require('../controllers/controller-receipt')
const { createItem, getAllItems, getItemsByReceipt, updateItem, removeItem } = require("../controllers/controller-items")

router.post('/claims', createClaim)
router.put('/claims', updateClaimEmployee)
router.delete('/claims', removeClaim)
router.get('/claims', getClaims)

router.post('/receipts/find',findReceiptInfo)
router.post('/receipts/add',addReceiptInfo)
router.delete('/receipts', deleteReceiptInfo)

router.post("/items/create", createItem)
router.get("/items/all", getAllItems)
router.post("/items/receipt", getItemsByReceipt)
router.put("/items/update", updateItem)
router.delete("/items/delete", removeItem)

module.exports = router