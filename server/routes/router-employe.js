const express = require('express')
const router = express.Router()
const { createClaim, updateClaimEmployee, removeClaim, getClaims, getOneClaim } = require('../controllers/controller-claim')
const { getBalance } = require('../controllers/controller-user')

const { createItem, getAllItems, getItemsByReceipt, updateItem, removeItem } = require("../controllers/controller-items")
const {isAuth} = require('../utils/authentication')
router.post('/claims', isAuth, createClaim)
router.patch('/claims', isAuth, updateClaimEmployee)
router.delete('/claims', isAuth, removeClaim)
router.get('/claims',isAuth, getClaims)
router.get('/claims/:claimId', getOneClaim);
router.get('/userBalance/:id', getBalance)


module.exports = router