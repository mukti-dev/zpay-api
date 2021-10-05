const { validationResult } = require('express-validator')


const checkValidationResult = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const mappedErrors = result.array()
        let errorArr = []
        for (let i = 0; i < mappedErrors.length; i++) {
            let newErrObj = {
                param: mappedErrors[i].param,
                msg: mappedErrors[i].msg

            }
            errorArr.push(newErrObj)

        }
        let resp = {
            success: false,
            message: "Data validation failed",
            errorCount: errorArr.length,
            error: errorArr
        }
        return res.status(400).json(resp);
    } else {
        next()
    }
}

module.exports = { checkValidationResult }