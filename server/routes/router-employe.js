const express = require('express')
const router = express.Router()
const { createClaim } = require('../controllers/controller-employee')

router.post('/claims', createClaim)
module.exports = router