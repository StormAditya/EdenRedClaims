const express = require('express')
const router = express.Router()
const { getUser, updateUser, removeUser } = require('../controllers/controller-user')
const { getAllClaims, updateClaimAdmin } = require('../controllers/controller-claim')
const { findReceiptInfo } = require('../controllers/controller-receipt')
const { addCategory, removeCategory } = require('../controllers/controller-category')
const  {isAdmin, isAuth} = require('../utils/authentication')

router.get('/claims', isAuth, isAdmin, getAllClaims)
router.patch('/claims', updateClaimAdmin)

router.get('/users',isAuth,isAdmin, getUser)
router.patch('/users',isAuth, isAdmin, updateUser)
router.delete('/users', isAuth, isAdmin, removeUser)

router.post('/receipts',isAuth, isAdmin,findReceiptInfo)

router.post('/category', isAuth, isAdmin, addCategory)
router.post('/category', isAuth, isAdmin, removeCategory)

module.exports = router