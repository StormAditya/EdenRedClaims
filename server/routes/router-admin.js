const express = require('express')
const router = express.Router()
const {getUser, removeUser} = require('../controllers/controller-admin')

router.get('/users', getUser)

router.delete('/users/:id', removeUser)

module.exports = router