const { saveUserData, userLogin, changePasswordManager, getAllUsers, checkedUser, toggleStatusManager } = require("../managers/user.manager")
const { generateJwtToken } = require("../services/jwt")
const { successResponse, failureResponse } = require("../services/responseGenerator")

const registerUser = async (req, res) => {
    try {
        let saveUser = await saveUserData(req.body)
        let responseData = JSON.parse(JSON.stringify(saveUser))
        delete responseData.password
        delete responseData.__v
        let authToken = await generateJwtToken(responseData)
        responseData.authToken = authToken
        console.log('response', responseData)
        successResponse(req, res, responseData, 'User data saved')
    } catch (error) {
        // console.log(error)
        failureResponse(req, res, error)
    }

}

const loginUser = async (req, res) => {
    try {
        let user = await userLogin(req.body)
        let userData = JSON.parse(JSON.stringify(user))
        delete userData.password
        delete userData.__v
        console.log('resposne', userData)
        let authToken = await generateJwtToken(userData)
        userData.authToken = authToken
        successResponse(req, res, userData, 'User Logged in successfully')
    } catch (error) {
        console.log(error)
        failureResponse(req, res, error)
    }
}

const changePassword = async (req, res) => {
    try {
        let result = await changePasswordManager(req.body)
        successResponse(req, res, result, 'Password changed successfully')
    } catch (error) {
        failureResponse(req, res, error)

    }
}
const allUsers = async (req, res) => {
    try {
        const userData = await getAllUsers()
        successResponse(req, res, userData, 'All Users data fetched successfully')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const checkUser = async (req, res) => {
    try {
        const result = await checkedUser(req.params.phone)
        successResponse(req, res, result, 'User Existance checked')
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const toggleStatus = async (req, res) => {
    try {
        const result = await toggleStatusManager(req.params.userid)
        successResponse(req, res, result, 'Status Changed')
    } catch (error) {
        failureResponse(req, res, error)
    }

}


module.exports = { registerUser, loginUser, changePassword, allUsers, checkUser, toggleStatus }