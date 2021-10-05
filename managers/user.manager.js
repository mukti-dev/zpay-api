const { decryptText, encryptText } = require('../helper/encryptDecrypt')
const Users = require('../models/users.models')
const InternalServer = require('../_errorHandler/500')
const UnauthorizedError = require('../_errorHandler/401')
const NotFoundError = require('../_errorHandler/404')
const { Login } = require('../models/login.models')
const { ObjectId } = require('mongoose').Types

const saveUserData = async (reqBody) => {
    try {
        const user = new Users(reqBody)
        let userData = await user.save()
        let loginData = new Login({
            userId: user._id,
            ipAddress: reqBody.ipAddress,
            location: reqBody.location,
            deviceType: reqBody.deviceType,
            deviceToken: reqBody.deviceToken,
            macAddresss: reqBody.macAddress
        })
        await loginData.save()
        return userData
    } catch (error) {
        console.log(error)
        throw new InternalServer(error)
    }
}

const userLogin = async (reqBody) => {
    try {
        console.log(reqBody)
        const user = await Users.findOne({ $and: [{ $or: [{ email: reqBody.username }, { phone: reqBody.username }] }, { status: "Active" }] }).exec()
        if (user && user !== null) {
            let isPwMatch = await decryptText(reqBody.password, user.password)
            if (!isPwMatch) {
                throw new UnauthorizedError("Wrong credentials")
            } else {
                let loginData = new Login({
                    userId: user._id,
                    ipAddress: reqBody.ipAddress,
                    location: reqBody.location,
                    deviceType: reqBody.deviceType,
                    deviceToken: reqBody.deviceToken,
                    macAddresss: reqBody.macAddress
                })

                console.log(loginData)
                await Users.updateOne({ _id: new ObjectId(user._id) }, { deviceType: reqBody.deviceType, deviceToken: reqBody.deviceToken })
                await loginData.save()
                let userData = JSON.parse(JSON.stringify(user))
                userData.deviceToken = reqBody.deviceToken
                userData.deviceType = reqBody.deviceType
                return userData
            }


        } else {
            throw new UnauthorizedError("Invalid User")
        }
    } catch (error) {
        throw error
    }
}

const changePasswordManager = async (reqBody) => {
    try {
        console.log(reqBody)
        let phone = reqBody.phone;
        let pw = reqBody.password;
        let password = await encryptText(pw)

        // const user = await Users.findOne({ phone: phone }).exec()
        // console.log(user)

        const result = await Users.findOneAndUpdate({ phone: phone }, {
            password: password,
        }, { returnOriginal: false })
        console.log(result)
        if (result && result !== null) {
            return true
        } else {
            throw new InternalServer('Wrong Inputs')
        }


    } catch (error) {
        throw new InternalServer(error)
    }

}

const getAllUsers = async () => {
    try {
        return await Users.find({}).exec()
    } catch (error) {
        throw error
    }
}

const checkedUser = async (phone) => {
    try {
        const user = await Users.find({ phone: phone }).exec()
        let data = {}
        if (user.length > 0) {
            data.isExist = true
        } else {
            data.isExist = false
        }
        return data
    } catch (error) {
        throw error
    }
}

const toggleStatusManager = async (userId) => {
    try {
        console.log(userId)
        const user = await Users.find({ _id: ObjectId(userId) }).exec()
        console.log(user)
        let updatedStatus = ""
        if (user.length > 0) {

            if (user[0].status == 'Active') {
                updatedStatus = "InActive"
            } else {
                updatedStatus = "Active"
            }
            const update = await Users.updateOne({ _id: ObjectId(userId) }, { status: updatedStatus }).exec()
            console.log(update)
            return true
        }
    } catch (error) {
        throw error
    }
}

const getUserById = async (userId) => {
    try {
        const user = await Users.find({ _id: new ObjectId(userId) }).exec()
        if (user.length > 0) {
            return user[0]
        } else {
            throw new NotFoundError('No record found with this Id')
        }
    } catch (error) {
        throw error
    }
}

module.exports = { saveUserData, userLogin, changePasswordManager, getAllUsers, checkedUser, toggleStatusManager, getUserById }