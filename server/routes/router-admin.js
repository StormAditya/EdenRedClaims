const express = require('express')
const router = express.Router()
const { getUser, updateUser, removeUser } = require('../controllers/controller-admin')

router.get('/users', getUser)
router.patch('/users',updateUser)
router.delete('/users/:id', removeUser)

module.exports = router