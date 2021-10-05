const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class ForbiddenError extends BaseError {
    constructor(
        name,
        statusCode = httpStatusCodes.FORBIDDEN,
        description = 'Forbidden',
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}

module.exports = ForbiddenError