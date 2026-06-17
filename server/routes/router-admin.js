const express = require('express')
const router = express.Router()
const { getUser, updateUser, removeUser } = require('../controllers/controller-user')
const { getAllClaims, updateClaimAdmin } = require('../controllers/controller-claim')
const { findReceiptInfo } = require('../controllers/controller-receipt')

router.get('/claims', getAllClaims)
router.patch('/claims', updateClaimAdmin)


router.get('/users', getUser)
router.patch('/users',updateUser)
router.delete('/users', removeUser)

router.post('/receipts',findReceiptInfo)

module.exports = router