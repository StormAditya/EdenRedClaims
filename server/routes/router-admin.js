const express = require('express')
const router = express.Router()
const {getUser} = require('../controllers/controller-admin')

router.get('/users', getUser)

module.exports = router