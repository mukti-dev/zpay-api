const express = require('express')
const { postPaid, perPaidOperatorCheck, perpaidPlan, perpaidOffer, electricity, dthCustomer, dthCustomerMobile, dthPlan, dthPlanWithChannel, gas, water, insurance, } = require('../controllers/fetchBill.controller')
const { authentication } = require('../services/auth.service')
const router = express.Router()

router.get('/postpaid', authentication, postPaid)
router.get('/perPaidOperatorCheck', authentication, perPaidOperatorCheck)
router.get('/perpaidPlan', authentication, perpaidPlan)
router.get('/perpaidOffer', authentication, perpaidOffer)
router.get('/electricity', authentication, electricity)
router.get('/dthCustomer', authentication, dthCustomer)
router.get('/dthCustomerMobile', authentication, dthCustomerMobile)
router.get('/dthPlan', authentication, dthPlan)
router.get('/dthPlanWithChannel', authentication, dthPlanWithChannel)
router.get('/gas', authentication, gas)
router.get('/water', authentication, water)
router.get('/insurance', authentication, insurance)

module.exports = router