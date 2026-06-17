const express = require('express')
const router = express.Router()
const { getUser, updateUser, removeUser } = require('../controllers/controller-user')
const { getClaims } = require('../controllers/controller-claim')
const { findReceiptInfo } = require('../controllers/controller-receipt')

router.get('/users', getUser)
router.patch('/users',updateUser)
router.delete('/users/:id', removeUser)
router.get('/claims', getClaims)
router.post('/receipts/:id',findReceiptInfo)

module.exports = router