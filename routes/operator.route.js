const express = require('express')
const { addOperator, editOperator, getOperator, getAllOperator, getCashBack } = require('../controllers/operator.controller')
const { authentication } = require('../services/auth.service')
const router = express.Router()

router.post('/add', authentication, addOperator)
router.post('/edit/:operatorId', authentication, editOperator)
router.get('/get/:operatorId', authentication, getOperator)
router.get('/getAll', authentication, getAllOperator)
router.get('/cashback/:operatorCode', authentication, getCashBack)


module.exports = router