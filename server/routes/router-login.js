const express = require('express')
const router = express.Router()
const {createUser, loginUser} = require('../controllers/controller-login')

router.post('/', createUser)

router.post('/', loginUser)

module.exports = router