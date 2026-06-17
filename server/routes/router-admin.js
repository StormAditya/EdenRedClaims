const express = require('express')
const router = express.Router()
const { getUser, updateUser, removeUser, getClaims } = require('../controllers/controller-admin')


router.get('/users', getUser)
router.patch('/users',updateUser)
router.delete('/users/:id', removeUser)
router.get('/claims', getClaims)

module.exports = router