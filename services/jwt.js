const jwt = require('jsonwebtoken')
const appConfig = require('../config/appConfig.json')
const secret = appConfig.JWT_SECRCET

const generateJwtToken = async (data) => {
    try {
        console.log(data)
        return jwt.sign({
            data: data
        }, secret, { expiresIn: '24h' });
    } catch (error) {
        throw error
    }
}

module.exports = { generateJwtToken }