const express = require('express')
const router = express.Router()
const { getUser, updateUser, removeUser, updateUserBalance, updateUserRole, updateUserPassword, getUserById } = require('../controllers/controller-user')
const { getAllClaims, updateClaimAdmin } = require('../controllers/controller-claim')
const { addCategory, removeCategory } = require('../controllers/controller-category')
const  {isAdmin, isAuth} = require('../utils/authentication')

router.get('/claims', isAuth, isAdmin, getAllClaims)
router.patch('/claims', updateClaimAdmin)

router.get('/users',isAuth,isAdmin, getUser)
router.get('/users/:id', isAuth, isAdmin, getUserById)
router.patch('/users',isAuth, isAdmin, updateUser)
router.delete('/users', isAuth, isAdmin, removeUser)
router.patch('/users/balance', isAuth, isAdmin, updateUserBalance)
router.patch('/users/role', isAuth, isAdmin, updateUserRole)
router.patch('/users/password', isAuth, isAdmin, updateUserPassword)

router.post('/category', isAuth, isAdmin, addCategory)
router.delete('/category', isAuth, isAdmin, removeCategory)

module.exports = router