const jwt = require('jsonwebtoken')
const User = require('../models/users.models')
const jwtSecret = require('../config/appConfig.json').JWT_SECRCET
const UnauthorizedError = require('../_errorHandler/401')
const ForbiddenError = require('../_errorHandler/403')
const { failureResponse } = require('./responseGenerator')
const { ObjectId } = require('mongoose').Types


const authentication = async (req, res, next) => {

    try {
        const token = req.headers.authorization
        const decoded = jwt.verify(token, jwtSecret);

        const id = decoded.data._id
        let user = await User.find({ $and: [{ _id: new ObjectId(id) }, { status: "Active" }] }).exec()
        if (user.length > 0) {
            user = JSON.parse(JSON.stringify(user))
            if (user[0].deviceType == decoded.data.deviceType && user[0].deviceToken == decoded.data.deviceToken) {
                delete user.password
                req.user = user
                next()
            } else {
                throw new ForbiddenError("Logged in at another device")
            }

        } else {
            throw new UnauthorizedError("Unauthicated")
        }

    } catch (err) {
        failureResponse(req, res, err)
    }

}

const customerAuthentication = async (req, res, next) => {
    try {
        let userType = req.user.userType
        if (userType == 'customer') {
            next()
        } else {
            let error = new UnauthorizedError("Access denied")
            failureResponse(req, res, error)
        }

    } catch (err) {
        err.statusCode = 401
        failureResponse(req, res, err)
    }
}
const adminAuthentication = async (req, res, next) => {
    try {
        let userType = req.user.userType
        if (userType == 'admin') {
            next()
        } else {
            let error = new UnauthorizedError("Access denied")
            failureResponse(req, res, error)
        }

    } catch (err) {
        err.statusCode = 401
        failureResponse(req, res, err)
    }
}
module.exports = { authentication, customerAuthentication, adminAuthentication }