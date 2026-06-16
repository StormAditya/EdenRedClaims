const express = require('express')
const router = express.Router()
const { getUser, updateUser } = require('../controllers/controller-admin')

router.get('/users', getUser)
router.patch('/users',updateUser)

module.exports = router