const { failureResponse, successResponse } = require("../services/responseGenerator")

const { addOperatorManager, updateOperatorManager, getOperatorManager, getAllOperatorManager, getOperatorCashback } = require('../managers/operator.manager')
const addOperator = async (req, res) => {
    try {
        const add = await addOperatorManager(req.body)
        successResponse(req, res, add, 'Operator added')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const editOperator = async (req, res) => {
    try {
        const opId = req.params.operatorId
        const result = await updateOperatorManager(opId, req.body)
        successResponse(req, res, result, 'Operator updated')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const getOperator = async (req, res) => {
    try {
        const opId = req.params.operatorId
        const operator = await getOperatorManager(opId)
        successResponse(req, res, operator, 'Operator found')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const getAllOperator = async (req, res) => {
    try {
        const operators = await getAllOperatorManager()
        successResponse(req, res, operators, 'Operators fetched')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const getCashBack = async (req, res) => {
    try {
        const cashbacks = await getOperatorCashback(req.params.operatorCode)
        successResponse(req, res, cashbacks, 'Operators fetched')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

module.exports = { addOperator, editOperator, getOperator, getAllOperator, getCashBack }