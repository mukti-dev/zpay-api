const successResponse = (req, res, data, msg) => {
    let response = {
        success: true,
        msg: msg,
        data: data
    }
    if (data === true) {
        delete response.data
    }
    res.status(200).send(response)
}
const failureResponse = (req, res, error) => {
    console.log(error)
    if (!error.statusCode) {
        error.statusCode = 500
    }
    let response = {
        success: false,
        msg: error.message,
        error: error.name
    }
    res.status(error.statusCode).send(response)
}

module.exports = { successResponse, failureResponse }
