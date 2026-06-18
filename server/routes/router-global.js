const express = require('express')
const router = express.Router()
const { getCategory } = require('../controllers/controller-category')
const { getStatus } = require('../controllers/controller-status')

router.get('/category', getCategory)
router.get('/status', getStatus)


module.exports = router