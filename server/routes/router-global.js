const express = require('express')
const router = express.Router()
const { getCategory } = require('../controllers/controller-category')

router.get('/', getCategory)


module.exports = router