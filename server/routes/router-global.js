const express = require('express')
const router = express.Router()
const { getCategory } = require('../controllers/controller-category')
const { getStatus } = require('../controllers/controller-status')
const { getCompany } = require('../controllers/controller-company')

router.get('/category', getCategory)
router.get('/status', getStatus)
router.get('/company', getCompany);


module.exports = router