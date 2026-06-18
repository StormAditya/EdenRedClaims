const express = require('express')
const router = express.Router()
const { createClaim, updateClaimEmployee, removeClaim, getClaims } = require('../controllers/controller-claim')
const { findReceiptInfo, addReceiptInfo, deleteReceiptInfo} = require('../controllers/controller-receipt')
const { isAuth } = require('../utils/authentication')

router.post('/claims', isAuth, createClaim)
router.put('/claims', isAuth, updateClaimEmployee)
router.delete('/claims', isAuth, removeClaim)
router.get('/claims',isAuth, getClaims)

router.post('/receipts/find', isAuth,findReceiptInfo)
router.post('/receipts/add', isAuth,addReceiptInfo)
router.delete('/receipts', isAuth,deleteReceiptInfo)

module.exports = router