const { body, validationResult, param } = require('express-validator')
const { ObjectId } = require('mongoose').Types
const Operator = require('../models/operator.model')


const cashbackValidate = () => {
    return [
        param('operatorCode').exists().withMessage("operatorCode required").custom(value => {
            return new Promise((resolve, reject) => {
                user.findOne({ email: value }, (error, doc) => {
                    if (error) {
                        reject(error)
                    } else {
                        if (doc) {
                            reject("Email Id already exist")
                        } else {
                            resolve(true)
                        }
                    }
                })
            })

        }),

    ]
}

module.exports = { cashbackValidate }