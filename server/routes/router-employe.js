const express = require('express')
const router = express.Router()
const { createClaim, updateClaimEmployee, removeClaim, getClaims } = require('../controllers/controller-claim')
const { createItem, getAllItems, getItemsByReceipt, updateItem, removeItem } = require("../controllers/controller-items")
const {isAuth} = require('../utils/authentication')
router.post('/claims', isAuth, createClaim)
router.patch('/claims', isAuth, updateClaimEmployee)
router.delete('/claims', isAuth, removeClaim)
router.get('/claims',isAuth, getClaims)


module.exports = router