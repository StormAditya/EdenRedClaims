const express = require('express')
const router = express.Router()
const { getUser, updateUser, removeUser } = require('../controllers/controller-user')
const { getClaims } = require('../controllers/controller-claim')


router.get('/users', getUser)
router.patch('/users',updateUser)
router.delete('/users/:id', removeUser)
router.get('/claims', getClaims)

module.exports = router