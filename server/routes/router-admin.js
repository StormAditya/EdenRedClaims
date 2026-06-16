const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const { getUser, updateUser } = require('../controllers/controller-admin')
=======
const {getUser, removeUser} = require('../controllers/controller-admin')
>>>>>>> 7a548f902dafd1cdf58adfec2faf7326b4148592

router.get('/users', getUser)
router.patch('/users',updateUser)

router.delete('/users/:id', removeUser)

module.exports = router