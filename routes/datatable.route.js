const express = require('express')
const { operatorList } = require('../controllers/dataTable.controller')
const router = express.Router()

router.post('/operatorList', operatorList)

module.exports = router

