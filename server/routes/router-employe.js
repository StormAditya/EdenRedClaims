const express = require('express')
const router = express.Router()
const { createClaim } = require('../controllers/controller-claim')

router.post('/claims', createClaim)
module.exports = router