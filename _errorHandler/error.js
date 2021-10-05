const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class UpgradeRequiredError extends BaseError {
    constructor(
        name,
        statusCode = httpStatusCodes.UPGRADE_REQUIRED,
        description = 'Upgrade Required Error',
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}

class InternalServerError extends BaseError {
    constructor(
        name,
        statusCode = httpStatusCodes.INTERNAL_SERVER,
        description = 'Internal Server Error',
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}


module.exports = { UpgradeRequiredError, InternalServerError }