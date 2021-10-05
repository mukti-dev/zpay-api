const express = require('express')
const { registerUser, loginUser, changePassword, allUsers, checkUser, toggleStatus } = require('../controllers/user.controller')
const { authentication } = require('../services/auth.service')
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/changePassword', changePassword)
router.get('/alluser', authentication, allUsers)
router.get('/phone/:phone', checkUser)
router.get('/toggleStatus/:userid', toggleStatus)

module.exports = router