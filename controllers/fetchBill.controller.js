const https = require('https')
const http = require('http')
const MPLAN = require('../config/appConfig.json').MPLAN
const { successResponse, failureResponse } = require('../services/responseGenerator')
const UnauthorizedError = require('../_errorHandler/401')
const perPaidOperatorCheck = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.phone;
        let str = "";
        console.log(tel)

        let options = {
            host: 'operatorcheck.mplan.in',
            port: 80,
            path: '/api/dthoperatorinfo.php?apikey=' + apikey + '&tel=' + tel,
            method: 'GET',
        };
        console.log(options)

        let x = http.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                console.log(json)
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Perpaid data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const perpaidPlan = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let cricle = req.query.circle;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/plans.php?apikey=' + apikey + '&cricle=' + cricle + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Perpaid Plan data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const perpaidOffer = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.phone;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/plans.php?apikey=' + apikey + '&&offer=roffer&tel=' + tel + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Perpaid Offer data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}
const postPaid = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.tel;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/Bsnl.php?apikey=' + apikey + '&offer=roffer&tel=' + tel + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Postpaid data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const electricity = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.phone;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/electricinfo.php?apikey=' + apikey + '&offer=roffer&tel=' + tel + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Electricity data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}
const dthCustomer = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.phone;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/Dthinfo.php?apikey=' + apikey + '&offer=roffer&tel=' + tel + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Dth Customer data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const dthCustomerMobile = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.phone;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/DthinfoMobile.php?apikey=' + apikey + '&offer=roffer&tel=' + tel + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Dth Customer Mobile data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const dthPlan = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/dthplans.php?apikey=' + apikey + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Dth Plan data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}


const dthPlanWithChannel = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/dth_plans.php?apikey=' + apikey + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Dth Plan With Channel data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const gas = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.phone;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/Gas.php?apikey=' + apikey + '&offer=roffer&tel=' + tel + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Gas data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const water = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.phone;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/Water.php?apikey=' + apikey + '&offer=roffer&tel=' + tel + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                console.log(str)
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Water data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

const insurance = (req, res) => {
    try {
        let apikey = MPLAN.API_KEY
        let tel = req.query.phone;
        let operator = req.query.operator;
        let str = "";

        let options = {
            host: 'mplan.in',
            port: 443,
            path: '/api/insurance.php?apikey=' + apikey + '&offer=roffer&tel=' + tel + '&operator=' + operator,
            method: 'GET',
        };

        let x = https.request(options, function (response) {
            console.log("Connected");
            response.on('data', function (data) {
                str += data;
            });
            response.on("end", function () {
                let json = JSON.parse(str);
                if (json.status == 0) {
                    let error = new UnauthorizedError(json)
                    failureResponse(req, res, error)
                } else {
                    successResponse(req, res, json, 'Insurance data fetched')
                }
            });
        });

        x.end();
    } catch (error) {
        failureResponse(req, res, error)
    }
}

module.exports = { perPaidOperatorCheck, perpaidPlan, perpaidOffer, postPaid, electricity, dthCustomer, dthCustomerMobile, dthPlan, dthPlanWithChannel, gas, water, insurance }