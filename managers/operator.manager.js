const Operator = require('../models/operator.model')
const { ObjectId } = require('mongoose').Types
const NotFoundError = require('../_errorHandler/404')
const addOperatorManager = async (reqBody) => {
    try {
        const operator = new Operator(reqBody)
        const result = await operator.save()
        return result
    } catch (error) {
        throw error
    }
}

const updateOperatorManager = async (id, reqBody) => {
    try {
        const result = await Operator.updateOne({ _id: new ObjectId(id) }, { reqBody }).exec()
        return true
    } catch (error) {
        throw error
    }
}

const getOperatorManager = async (id) => {
    try {
        const result = await Operator.findOne({ _id: new ObjectId(id) }).exec()
        if (result && result !== null) {
            return result
        } else {
            let err = new NotFoundError('Operator not found')
            throw err
        }
    } catch (error) {
        throw error
    }
}

const getAllOperatorManager = async () => {
    try {
        const result = await Operator.find({ status: 'Active' }).exec()
        if (result.length > 0) {
            return result
        } else {
            let err = new NotFoundError('No Operator found')
            throw err
        }
    } catch (erorr) {
        throw error
    }
}

const getOperatorCashback = async (operatorCode) => {
    try {
        const result = await Operator.find({ operatorCode: operatorCode }).exec()
        if (result.length > 0) {
            let data = JSON.parse(JSON.stringify(result[0]))
            delete data.cashbackPercentageForZpay
            delete data.__v
            return data
        } else {
            let err = new NotFoundError('No Operator found')
            throw err
        }
    } catch (erorr) {
        throw error
    }
}

module.exports = { addOperatorManager, updateOperatorManager, getOperatorManager, getAllOperatorManager, getOperatorCashback }